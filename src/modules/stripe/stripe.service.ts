import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionService } from '../subscription/subscription.service';
import { PaymentType, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});
  }

  getInstance(): Stripe {
    return this.stripe;
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
        startDate: new Date(),
        expiredDate: new Date(Date.now() + 1000 ** 60 * 60 * 24 * 30),
        status: SubscriptionStatus.Created,
        paymentType: PaymentType.STRIPE,
        subscriptionTypeId: +object.metadata.subscriptionTypeId,
        userId: +object.metadata.userId,
        price: subscriptionType.price,
      });
      return true;
    }

    if (eventType === 'invoice.paid') {
      const subscription = await this.subscriptionService.update(
        +object.metadata.subscriptionId,
        {
          status: SubscriptionStatus.Paid,
        },
      );
    }

    if (eventType === 'invoice.payment_failed') {
      await this.subscriptionService.remove(+object.metadata.subscriptionId);
    }
  }
}
