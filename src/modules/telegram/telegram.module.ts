import { Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [TelegramUpdate],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class AdminModule {}
