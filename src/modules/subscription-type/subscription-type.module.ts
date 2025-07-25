import { Module } from '@nestjs/common';
import { SubscriptionTypeService } from './subscription-type.service';
import { SubscriptionTypeController } from './subscription-type.controller';

@Module({
  controllers: [SubscriptionTypeController],
  providers: [SubscriptionTypeService],
  exports: [SubscriptionTypeService],
})
export class SubscriptionTypeModule {}
