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
import { env } from 'src/common/config';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    let data: any;
    let eventType: any;
    // Check if webhook signing is configured.
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && env.ENV === 'prod') {
      // Retrieve the event by verifying the signature using the raw body and secret.
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
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    res.status(200).json(await this.stripeService.webhook(eventType, data));
  }
}
