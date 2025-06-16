import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { SubscriptionTypeModule } from './modules/subscription-type/subscription-type.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { env } from './common/config';
import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { session } from 'grammy';

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
      middlewares: [session({ initial: () => ({}) })],
    }),
  ],
})
export class AppModule {}
