import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [forwardRef(() => TelegramModule)],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
