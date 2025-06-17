import { Injectable } from '@nestjs/common';
import { CreateAtmoDto } from './dto/create.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import axios from 'axios';
import { env } from 'src/common/config';
import { AtmosDto } from './dto/atmos.dto';
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
    const res = await axios.post(
      'https://apigw.atmos.uz/checkout/invoice/create',
      {
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
      },
    );
    return res.data.url;
  }
}
