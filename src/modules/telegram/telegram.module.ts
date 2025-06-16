import { Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TelegramUpdate],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class AdminModule {}
