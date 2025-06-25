import { Module } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { AtmosController } from './atmos.controller';
import { TelegramModule } from '../telegram/telegram.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  controllers: [AtmosController],
  providers: [AtmosService],
  imports: [TelegramModule, SubscriptionModule],
})
export class AtmosModule {}
