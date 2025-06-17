import { Controller, Post, Req, Res, Headers, HttpCode, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { env } from 'src/common/config';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('session')
  async createCheckoutSession(@Req() req: Request, @Res() res: Response) {
    const { userId, subscriptionTypeId } = req.body;
    if (!userId || !subscriptionTypeId) {
      return res
        .status(400)
        .json({ error: 'Missing userId or subscriptionTypeId' });
    }
    const session = await this.stripeService.createCheckoutSession({
      userId,
      subscriptionTypeId,
    });
    res.status(200).json(session);
    return res;
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers['stripe-signature']
      try {
        event = this.stripeService
          .getInstance()
          .webhooks.constructEvent(
            req.rawBody,
            signature,
            webhookSecret,
          );
      } catch (err) {
        console.log(err);
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

    return this.stripeService.webhook(eventType, data);
  }
}
