import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [UserModule, SubscriptionModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
