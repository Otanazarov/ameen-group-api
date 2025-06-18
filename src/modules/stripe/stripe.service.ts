import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionService } from '../subscription/subscription.service';
import { PaymentType, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
    private readonly telegramService: TelegramService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});
  }

  getInstance(): Stripe {
    return this.stripe;
  }

  async createCheckoutSession(dto: CreateSessionDto) {
    const { userId, subscriptionTypeId } = dto;

    const subscriptionType = await this.prisma.subscriptionType.findFirst({
      where: {
        id: subscriptionTypeId,
      },
    });

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    if (!subscriptionType) {
      throw new Error('Subscription type not found');
    }
    let product = (
      await this.stripe.products.search({
        query: `name:'${subscriptionType.title}'`,
      })
    ).data[0];
    if (!product) {
      product = await this.stripe.products.create({
        name: subscriptionType.title,
        description: subscriptionType.description,
      });
    }

    let price = (
      await this.stripe.prices.search({
      query: `product:'${product.id}' AND type: 'recurring' AND metadata['amout']:'${subscriptionType.price * 100}'`,
      })
    ).data[0];
    if (!price) {
      price = await this.stripe.prices.create({
        unit_amount: subscriptionType.price * 100, // Convert to cents
        currency: 'uzs',
        product: product.id,
        metadata: { amout: subscriptionType.price * 100 },
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      });
    }

    const botUsername = this.telegramService.bot.botInfo.username;
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
        subscriptionTypeId: subscriptionTypeId.toString(),
      },
      success_url: `https://t.me/${botUsername}?start=success`,
      cancel_url: `https://t.me/${botUsername}?start=cancel`,
    });

    return session;
  }

  async webhook(eventType: Stripe.Event.Type, data: Stripe.Event.Data) {
    const object = data.object as Stripe.Checkout.Session;
    if (eventType === 'checkout.session.completed') {
      const subscriptionType = await this.prisma.subscriptionType.findFirst({
        where: {
          id: +object.metadata.subscriptionTypeId,
        },
      });

      const subscription = await this.subscriptionService.create({
        status: SubscriptionStatus.Paid,
        paymentType: PaymentType.STRIPE,
        subscriptionTypeId: +object.metadata.subscriptionTypeId,
        userId: +object.metadata.userId,
        price: subscriptionType.price,
      });
      return true;
    }
  }
}
