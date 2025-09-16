import { forwardRef, Module } from '@nestjs/common';
import { AtmosModule } from '../atmos/atmos.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { MessageModule } from '../message/message.module';
import { OctoBankModule } from '../octobank/octobank.module';
import { SettingsModule } from '../settings/settings.module';
import { SubscriptionTypeModule } from '../subscription-type/subscription-type.module';
import { UserModule } from '../user/user.module';
import { TelegramButtonService } from './services/telegram.button.service';
import { TelegramCallbackService } from './services/telegram.callback.service';
import { TelegramCronService } from './services/telegram.cron.service';
import { TelegramRegistrationService } from './services/telegram.registration.service';
import { TelegramSenderService } from './services/telegram.sender.service';
import { TelegramSettingsService } from './services/telegram.settings.service';
import { TelegramSubscriptionService } from './services/telegram.subscription.service';
import { TelegramService } from './telegram.service';
import { TelegramMessageService } from './services/telegram.message.service';
import { TelegramUpdate } from './telegram.update';

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
  providers: [
    TelegramService,
    TelegramUpdate,
    TelegramCallbackService,
    TelegramCronService,
    TelegramRegistrationService,
    TelegramSenderService,
    TelegramSettingsService,
    TelegramSubscriptionService,
    TelegramButtonService,
    TelegramMessageService,
  ],
  exports: [
    TelegramService,
    TelegramCallbackService,
    TelegramCronService,
    TelegramRegistrationService,
    TelegramSenderService,
    TelegramSettingsService,
    TelegramSubscriptionService,
    TelegramButtonService,
    TelegramMessageService,
  ],
})
export class TelegramModule {}
