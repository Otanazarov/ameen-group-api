import { Injectable } from '@nestjs/common';
import { CreateAtmosDto } from './dto/create.dto';
import { PrismaService } from '../prisma/prisma.service';
import { env } from 'src/common/config';
import { atmosApi } from 'src/common/utils/axios';
import { TransactionService } from '../trasnaction/transaction.service';
import { TransactionStatus } from '@prisma/client';
import { PreApplyAtmosDto } from './dto/preapply.dto';

@Injectable()
export class AtmosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
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

    await this.transactionService.create({
      userId,
      subscriptionTypeId,
      price: subscriptionType.price,
      paymentType: 'ATMOS',
      status: 'Created',
      transactionId: transactionId.toString(),
    });

    return res.data;
  }
  async preApplyTransaction(dto: PreApplyAtmosDto): Promise<any> {
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
      const subscription = await this.transactionService.findOneByTransactionId(
        result.data.store_transaction.trans_id.toString(),
      );
      await this.transactionService.update(subscription.id, {
        status: TransactionStatus.Paid,
      });
    }

    return result.data;
  }

  async getPendingInvoices() {
    return this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.Created,
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

    const transaction =
      await this.transactionService.findOneByTransactionId(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const isSuccess =
      data.store_transaction?.confirmed === true &&
      data.store_transaction?.status_message === 'Success';

    if (isSuccess) {
      await this.transactionService.update(transaction.id, { status: 'Paid' });
    } else if (
      data.store_transaction?.status_message === 'Canceled' ||
      data.result?.code === 'STPIMS-ERR-092'
    ) {
      await this.transactionService.update(transaction.id, {
        status: 'Canceled',
      });
    }
    return data;
  }
}
