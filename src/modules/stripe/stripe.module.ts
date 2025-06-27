import { forwardRef, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
  imports: [SubscriptionModule, forwardRef(() => TelegramModule)],
})
export class StripeModule {}
