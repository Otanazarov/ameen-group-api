import { forwardRef, Module } from '@nestjs/common';
import { OctoBankService } from './octobank.service';
import { OctoBankController } from './octobank.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TelegramModule } from '../telegram/telegram.module';
import { TransactionModule } from '../trasnaction/transaction.module';

@Module({
  providers: [OctoBankService],
  controllers: [OctoBankController],
  exports: [OctoBankService],
  imports: [
    SubscriptionModule,
    TransactionModule,
    forwardRef(() => TelegramModule),
  ],
})
export class OctoBankModule {}
