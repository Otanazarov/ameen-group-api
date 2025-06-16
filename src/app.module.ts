import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { SubscriptionTypeModule } from './modules/subscription-type/subscription-type.module';
import { StripeModule } from './modules/stripe/stripe.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AdminModule, PrismaModule, UserModule, SubscriptionTypeModule, StripeModule],
})
export class AppModule {}
