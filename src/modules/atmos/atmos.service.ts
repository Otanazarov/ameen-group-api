import { Injectable } from '@nestjs/common';
import { CreateAtmoDto } from './dto/create.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import axios from 'axios';
import { env } from 'src/common/config';
import { AtmosDto } from './dto/atmos.dto';
import { SubscriptionStatus } from '@prisma/client';
import { atmosApi } from 'src/common/utils/axios';
@Injectable()
export class AtmosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async createLink(dto: CreateAtmoDto) {
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
    const res = await atmosApi.post('merchant/pay/confirm-with-ofd-list', {
      request_id: subscriptionTypeId, // unique identifier for the request
      store_id: env.ATMOS_STORE_ID, // your store ID
      account: userId, // your telegram ID or internal user ID
      amount: subscriptionType.price, // in tiyins (i.e., cents)
      success_url: this.telegramService.bot.botInfo.username, // optional
      items: [
        {
          items_id: subscriptionTypeId,
          name: subscriptionType.title,
          description: subscriptionType.description,
          amount: subscriptionType.price,
          quantity: 1,
        },
      ],
    });
    console.log(res);

    const transactionId = res.data.transaction_id;

    // Subscription yaratish
    await this.prisma.subscription.create({
      data: {
        userId,
        subscriptionTypeId,
        startDate: new Date(),
        expiredDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 kun
        price: subscriptionType.price,
        paymentType: 'ATMOS',
        status: 'Created',
        transactionId: transactionId.toString(), // string type
      },
    });

    return res.data;
  }

  async getPendingInvoices() {
    return this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.Created, // yoki UNPAID, custom status
        paymentType: 'ATMOS',
        createdAt: {
          gt: new Date(Date.now() - 1000 * 60 * 30), // so‘nggi 30 daqiqaliklar
        },
      },
    });
  }

  async checkTransactionStatus(transactionId: string) {
    const { data } = await atmosApi.post(
      '/merchant/pay/get',
      {
        store_id: +env.ATMOS_STORE_ID,
        transaction_id: +transactionId,
      },
    );

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
