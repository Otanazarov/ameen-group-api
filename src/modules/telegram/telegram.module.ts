import { forwardRef, Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';
import { SubscriptionTypeModule } from '../subscription-type/subscription-type.module';
import { SettingsModule } from '../settings/settings.module';
import { MessageModule } from '../message/message.module';
import { OctoBankModule } from '../octobank/octobank.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { AtmosModule } from '../atmos/atmos.module';

@Module({
  imports: [
    UserModule,
    SubscriptionTypeModule,
    SettingsModule,
    ButtonsModule,
    forwardRef(() => OctoBankModule),
    forwardRef(() => AtmosModule),
    forwardRef(() => MessageModule),
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
