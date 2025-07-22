import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PaymentType, TransactionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { TelegramService } from '../telegram/telegram.service';
import { TransactionService } from '../trasnaction/transaction.service';
import { OctobankDto, OctobankStatus } from './dto/octobank.dto';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { env } from 'src/common/config';

@Injectable()
export class OctoBankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
  ) {}

  format(date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  async createCheckoutSession(dto: CreateSessionDto): Promise<{
    error: number;
    data: {
      shop_transaction_id: string;
      octo_payment_UUID: string;
      status: string;
      octo_pay_url: string;
      refunded_sum: number;
      total_sum: number;
    };
    apiMessageForDevelopers: string;
    shop_transaction_id: string;
    octo_payment_UUID: string;
    status: string;
    octo_pay_url: string;
    refunded_sum: number;
    total_sum: number;
  }> {
    const { userId, subscriptionTypeId } = dto;

    const subscriptionType = await this.prisma.subscriptionType.findFirst({
      where: {
        id: subscriptionTypeId,
      },
    });

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    if (!subscriptionType) {
      throw new Error('Subscription type not found');
    }

    const botUsername = this.telegramService.bot.botInfo.username;

    const transaction = await this.transactionService.create({
      subscriptionTypeId,
      userId,
      transactionId: uuidv4(),
      status: TransactionStatus.Created,
      paymentType: PaymentType.OCTOBANK,
      price: subscriptionType.price,
    });
    // return { octo_pay_url: 'https://example.com' } as any;
    const session = await axios.post('https://secure.octo.uz/prepare_payment', {
      octo_shop_id: env.OCTOBANK_SHOP_ID,
      octo_secret: env.OCTOBANK_SECRET_KEY,
      shop_transaction_id: transaction.transactionId,
      auto_capture: true,
      test: true,
      init_time: this.format(new Date()),
      user_data: {
        user_id: user.id,
        phone: user.phoneNumber,
        email: user.email || 'empty',
      },
      total_sum: transaction.price,
      currency: 'UZS',
      description: 'TEST_PAYMENT',
      basket: [
        {
          position_desc: subscriptionType.title,
          count: 1,
          price: transaction.price,
          spic: transaction.subscriptionTypeId,
        },
      ],
      payment_methods: [
        {
          method: 'bank_card',
        },
        {
          method: 'uzcard',
        },
        {
          method: 'humo',
        },
      ],
      tsp_id: 18,
      return_url: `https://t.me/${botUsername}?start=success`,
      notify_url: `${env.BACKEND_URL}/api/octobank`,
      language: 'uz',
      ttl: 15,
    });
    return session.data;
  }

  async webhook(dto: OctobankDto) {
    if (dto.status === OctobankStatus.succeeded) {
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          transactionId: dto.shop_transaction_id.toString(),
        },
      });
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      await this.transactionService.update(transaction.id, {
        status: TransactionStatus.Paid,
      });

      return true;
    }
  }
}
