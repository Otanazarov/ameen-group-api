import { Injectable } from '@nestjs/common';
import { CreateAtmosDto } from './dto/create.dto';
import { PrismaService } from '../prisma/prisma.service';
import { env } from 'src/common/config';
import { SubscriptionStatus } from '@prisma/client';
import { atmosApi } from 'src/common/utils/axios';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class AtmosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async createLink(dto: CreateAtmosDto) {
    const { userId, subscriptionTypeId } = dto;
    if (!userId || !subscriptionTypeId) {
      throw new Error('Missing userId or subscriptionTypeId');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const subscriptionType = await this.prisma.subscriptionType.findUnique({
      where: { id: subscriptionTypeId },
    });
    if (!subscriptionType) {
      throw new Error('Subscription type not found');
    }
    const res = await atmosApi.post('merchant/pay/create', {
      store_id: env.ATMOS_STORE_ID, // your store ID
      account: userId, // your telegram ID or internal user ID
      amount: subscriptionType.price, // in tiyins (i.e., cents)
      details: subscriptionType.id.toString(),
    });
    const transactionId = res.data.transaction_id;

    // Subscription yaratish
    await this.prisma.subscription.create({
      data: {
        userId,
        subscriptionTypeId,
        startDate: new Date(),
        expiredDate: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * subscriptionType.expireDays,
        ),
        price: subscriptionType.price,
        paymentType: 'ATMOS',
        status: 'Created',
        transactionId: transactionId.toString(), // string type
      },
    });

    return res.data;
  }
  async preApplyTransaction(dto: {
    transaction_id: number;
    card_number: string;
    expiry: string;
  }): Promise<any> {
    const preApplyData = {
      transaction_id: dto.transaction_id,
      card_number: dto.card_number,
      expiry: dto.expiry,
      store_id: env.ATMOS_STORE_ID,
    };

    const result = await atmosApi.post('/merchant/pay/pre-apply', preApplyData);

    return result.data;
  }
  async applyTransaction(dto: {
    transaction_id: number;
    otp: string;
  }): Promise<any> {
    const applyData = {
      transaction_id: dto.transaction_id,
      otp: dto.otp,
      store_id: env.ATMOS_STORE_ID,
    };

    const result = await atmosApi.post('/merchant/pay/confirm', applyData);
    if (!result.data.store_transaction) return result.data;
    if (result.data.store_transaction.status_message == 'Success') {
      const subscription = await this.prisma.subscription.findUnique({
        where: {
          transactionId: result.data.store_transaction.trans_id.toString(),
        },
      });
      await this.subscriptionService.update(subscription.id, {
        status: SubscriptionStatus.Paid,
      });
    }

    return result.data;
  }

  async getPendingInvoices() {
    return this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.Created,
        paymentType: 'ATMOS',
        createdAt: {
          gt: new Date(Date.now() - 1000 * 60 * 30),
        },
      },
    });
  }

  async checkTransactionStatus(transactionId: string) {
    const { data } = await atmosApi.post('/merchant/pay/get', {
      store_id: +env.ATMOS_STORE_ID,
      transaction_id: +transactionId,
    });

    const isSuccess =
      data.store_transaction?.confirmed === true &&
      data.store_transaction?.status_message === 'Success';

    if (isSuccess) {
      await this.prisma.subscription.update({
        where: { transactionId },
        data: { status: 'Paid' },
      });
    } else if (
      data.store_transaction?.status_message === 'Canceled' ||
      data.result?.code === 'STPIMS-ERR-092'
    ) {
      await this.prisma.subscription.update({
        where: { transactionId },
        data: { status: 'Canceled' },
      });
    }
    return data;
  }
}
