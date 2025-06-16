import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
  imports: [SubscriptionModule],
})
export class StripeModule {}
