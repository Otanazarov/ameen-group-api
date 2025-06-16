import { Injectable } from '@nestjs/common';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllSubscriptionTypeDto } from './dto/findAll-subscriptionType.dto';

@Injectable()
export class SubscriptionTypeService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    const subscriptionType = await this.prisma.subscriptionType.create({
      data: createSubscriptionTypeDto,
    });

    return {
      ...subscriptionType,
      price: subscriptionType.price.toString(),
    };
  }

  async findAll(dto: FindAllSubscriptionTypeDto) {
    const { limit = 10, page = 1, title } = dto;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.subscriptionType.findMany({
        where: {
          title: {
            contains: title?.trim() || '',
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscriptionType.count({
        where: {
          title: {
            contains: title?.trim() || '',
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: data.map((subscriptionType) => ({
        ...subscriptionType,
        price: subscriptionType.price.toString(),
      })),
    };
  }

  async findOne(id: number) {
    const subscriptionType = await this.prisma.subscriptionType.findUnique({
      where: { id },
    });
    if (!subscriptionType) {
      throw new Error(`Subscription type with id ${id} not found`);
    }
    return {
      ...subscriptionType,
      price: subscriptionType.price.toString(),
    };
  }

  async update(id: number, dto: UpdateSubscriptionTypeDto) {
    const existing = await this.prisma.subscriptionType.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new Error(`Subscription type with id ${id} not found`);
    }
    const updateData = {
      price: dto.price ?? existing.price,
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      telegramTopicIds: dto.telegramTopicIds ?? existing.telegramTopicIds,
    };

    const updatedSubscriptionType = await this.prisma.subscriptionType.update({
      where: { id },
      data: updateData,
    });

    return {
      ...updatedSubscriptionType,
      price: updatedSubscriptionType.price.toString(),
    };
  }

  async remove(id: number) {
    const existing = await this.prisma.subscriptionType.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new Error(`Subscription type with id ${id} not found`);
    }
    await this.prisma.subscriptionType.delete({
      where: { id },
    });
    return { message: `Subscription type with id ${id} deleted successfully` };
  }
}
