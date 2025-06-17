import { Module } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { AtmosController } from './atmos.controller';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  controllers: [AtmosController],
  providers: [AtmosService],
  imports: [TelegramModule],
})
export class AtmosModule {}
