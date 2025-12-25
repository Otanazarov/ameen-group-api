import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionTypeModule } from '../subscription-type/subscription-type.module';

@Module({
  imports: [UserModule, forwardRef(() => SubscriptionModule), SubscriptionTypeModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
