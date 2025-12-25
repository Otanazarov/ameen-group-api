import { Module, forwardRef } from '@nestjs/common';
import { ViaService } from './via.service';
import { ViaController } from './via.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TelegramModule } from '../telegram/telegram.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
    imports: [PrismaModule, TelegramModule, forwardRef(() => SubscriptionModule)],
    controllers: [ViaController],
    providers: [ViaService],
    exports: [ViaService],
})
export class ViaModule { }
