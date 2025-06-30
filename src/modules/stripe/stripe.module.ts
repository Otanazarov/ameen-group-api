import { forwardRef, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TelegramModule } from '../telegram/telegram.module';
import { TransactionModule } from '../trasnaction/transaction.module';

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
  imports: [
    SubscriptionModule,
    TransactionModule,
    forwardRef(() => TelegramModule),
  ],
})
export class StripeModule {}
