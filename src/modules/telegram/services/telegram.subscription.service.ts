import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AtmosService } from 'src/modules/atmos/atmos.service';
import { OctoBankService } from 'src/modules/octobank/octobank.service';
import { SubscriptionTypeService } from 'src/modules/subscription-type/subscription-type.service';
import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';

@Injectable()
export class TelegramSubscriptionService {
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;
  constructor(
    private readonly userService: UserService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
    @Inject(forwardRef(() => OctoBankService))
    private readonly octobankService: OctoBankService,
    @Inject(forwardRef(() => AtmosService))
    private readonly atmosService: AtmosService,
  ) {}

  calculateDaysLeft(expiredDate: Date): number {
    return Math.ceil((expiredDate.getTime() - Date.now()) / this.MS_PER_DAY);
  }

  async handleSubscriptionPayment(ctx: Context, subscriptionTypeId: number) {
    const subscriptionType = await this.subscriptionTypeService.findOne(
      subscriptionTypeId,
    );
    if (!subscriptionType) {
      await ctx.answerCallbackQuery('❌ Subscription type not found');
      await ctx.deleteMessage();
      return;
    }
    const subscription = await this.userService.getSubscription(ctx.from.id);
    const daysLeft = subscription
      ? this.calculateDaysLeft(subscription.expiredDate)
      : 0;
    if (
      subscription &&
      subscription.subscriptionTypeId == subscriptionTypeId &&
      daysLeft > 3
    ) {
      await ctx.answerCallbackQuery({
        text: "⚠️ Siz allaqachon ushbu obunaga a'zo bo'lgansiz",
        show_alert: true,
      });
      return;
    }
    const user = await this.userService.findOneByTelegramID(
      ctx.from.id.toString(),
    );

    const atmos = await this.atmosService.createLink({
      subscriptionTypeId: subscriptionType.id,
      userId: user.id,
    });

    const octobank = await this.octobankService.createCheckoutSession({
      subscriptionTypeId,
      userId: user.id,
    });

    return { subscriptionType, octobank, atmos };
  }
}
