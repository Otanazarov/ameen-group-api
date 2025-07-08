import {
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  RawBodyRequest,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { env } from 'src/common/config';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @HttpCode(200)
  @DecoratorWrapper('Stripe Webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    let data: any;
    let eventType: any;
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && env.ENV === 'prod') {
      let event: any;
      const signature = req.headers['stripe-signature'];
      try {
        event = this.stripeService
          .getInstance()
          .webhooks.constructEvent(req.rawBody, signature, webhookSecret);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data;
      eventType = event.type;
    } else {
      data = req.body.data;
      eventType = req.body.type;
    }

    res.status(200).json(await this.stripeService.webhook(eventType, data));
  }
}
