import { forwardRef, Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';
import { SubscriptionTypeModule } from '../subscription-type/subscription-type.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [UserModule, SubscriptionTypeModule, forwardRef(() => StripeModule)],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
