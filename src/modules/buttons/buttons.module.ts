import { Module } from '@nestjs/common';
import { ButtonsService } from './buttons.service';
import { ButtonsController } from './buttons.controller';

@Module({
  controllers: [ButtonsController],
  providers: [ButtonsService],
  exports: [ButtonsService],
})
export class ButtonsModule {}
