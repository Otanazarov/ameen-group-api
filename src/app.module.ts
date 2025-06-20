import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { SubscriptionTypeModule } from './modules/subscription-type/subscription-type.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { env } from './common/config';
import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { session } from 'grammy';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AtmosModule } from './modules/atmos/atmos.module';
import { SessionData } from './modules/telegram/Context.type';
import { freeStorage } from '@grammyjs/storage-free';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    AdminModule,
    PrismaModule,
    UserModule,
    SubscriptionTypeModule,
    StripeModule,
    NestjsGrammyModule.forRoot({
      token: env.TELEGRAM_BOT_TOKEN,
      pollingOptions: {
        allowed_updates: ['chat_member', 'message', 'callback_query'],
      },
      middlewares: [
        session({
          initial: () => ({}),
          // storage: freeStorage<SessionData>(env.TELEGRAM_BOT_TOKEN) as any,
        }),
      ],
    }),
    SubscriptionModule,
    AtmosModule,
    ScheduleModule.forRoot(),
    SettingsModule,
  ],
})
export class AppModule { }
