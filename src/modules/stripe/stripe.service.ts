import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import {
  PaymentType,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { TelegramService } from '../telegram/telegram.service';
import { TransactionService } from '../trasnaction/transaction.service';

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
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
        query: `product:'${product.id}' AND type: 'recurring' AND metadata['amount']:'${subscriptionType.price * 100}'`,
      })
    ).data[0];
    if (!price) {
      price = await this.stripe.prices.create({
        unit_amount: subscriptionType.price * 100, // Convert to cents
        currency: 'uzs',
        product: product.id,
        metadata: { amount: subscriptionType.price * 100 },
        recurring: {
          interval: 'day',
          interval_count: subscriptionType.expireDays,
        },
      });
    }

    const botUsername = this.telegramService.bot.botInfo.username;

    const transaction = await this.transactionService.create({
      subscriptionTypeId,
      userId,
      status: TransactionStatus.Created,
      paymentType: PaymentType.STRIPE,
      price: subscriptionType.price,
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
      metadata: {
        userId: userId.toString(),
        subscriptionTypeId: subscriptionTypeId.toString(),
        transactionId: transaction.id.toString(),
      },
      success_url: `https://t.me/${botUsername}?start=success`,
      cancel_url: `https://t.me/${botUsername}?start=cancel`,
    });

    return session;
  }

  async webhook(eventType: Stripe.Event.Type, data: Stripe.Event.Data) {
    if (eventType === 'checkout.session.completed') {
      const object = data.object as Stripe.Checkout.Session;
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          id: +object.metadata.transactionId,
        },
      });
      await this.transactionService.update(subscription.id, {
        status: TransactionStatus.Paid,
        subscriptonTypeId: +object.metadata.subscriptionTypeId,
        userId: +object.metadata.userId,
      });

      return true;
    }

    if (eventType === 'invoice.paid') {
      const object = data.object as Stripe.Invoice;
      if (JSON.stringify(object.parent.subscription_details.metadata) == '{}')
        return;
      const subscriptionType = await this.prisma.subscriptionType.findFirst({
        where: {
          id: +object.parent.subscription_details.metadata.subscriptionTypeId,
        },
      });

      await this.transactionService.create({
        type: TransactionType.AUTO,
        status: TransactionStatus.Paid,
        paymentType: PaymentType.STRIPE,
        subscriptionTypeId:
          +object.parent.subscription_details.metadata.subscriptionTypeId,
        userId: +object.parent.subscription_details.metadata.userId,
        price: subscriptionType.price,
      });
      return true;
    }

    if (eventType === 'checkout.session.expired') {
      const object = data.object as Stripe.Checkout.Session;
      const subscriptionType = await this.prisma.subscriptionType.findFirst({
        where: {
          id: +object.metadata.subscriptionTypeId,
        },
      });

      await this.transactionService.create({
        status: TransactionStatus.Canceled,
        paymentType: PaymentType.STRIPE,
        subscriptionTypeId: +object.metadata.subscriptionTypeId,
        userId: +object.metadata.userId,
        price: subscriptionType.price,
      });
      return true;
    }
  }
}
