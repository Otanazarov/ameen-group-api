import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { session } from 'grammy';
import { env } from './common/config';
import { AdminModule } from './modules/admin/admin.module';
import { AtmosModule } from './modules/atmos/atmos.module';
import { MessageModule } from './modules/message/message.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SettingsModule } from './modules/settings/settings.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { SubscriptionTypeModule } from './modules/subscription-type/subscription-type.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UserModule } from './modules/user/user.module';
import { freeStorage } from '@grammyjs/storage-free';
import { SessionData } from './modules/telegram/Context.type';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    AdminModule,
    UserModule,
    SettingsModule,
    MessageModule,
    SubscriptionModule,
    SubscriptionTypeModule,
    AtmosModule,
    StripeModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    NestjsGrammyModule.forRoot({
      token: env.TELEGRAM_BOT_TOKEN,
      pollingOptions: {
        allowed_updates: [
          'chat_member',
          'message',
          'callback_query',
          'chat_join_request',
        ],
      },
      middlewares: [
        session({
          initial: () => ({}),
          storage: freeStorage<SessionData>(env.TELEGRAM_BOT_TOKEN) as any,
        }),
      ],
    }),
    StatisticsModule,
  ],
})
export class AppModule {}
