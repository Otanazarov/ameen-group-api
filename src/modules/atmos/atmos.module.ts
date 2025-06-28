import { Module } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { AtmosController } from './atmos.controller';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  controllers: [AtmosController],
  providers: [AtmosService],
  imports: [SubscriptionModule],
})
export class AtmosModule {}
