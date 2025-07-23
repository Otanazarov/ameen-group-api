import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllTransactionDto } from './dto/findAll-transaction.dto';
import { Prisma, Transaction, TransactionStatus } from '@prisma/client';
import { SubscriptionService } from '../subscription/subscription.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createTransactionDto.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const subscriptionType = await this.prisma.subscriptionType.findFirst({
      where: { id: createTransactionDto.subscriptionTypeId },
    });
    if (!subscriptionType) {
      throw new Error('Subscription type not found');
    }
    if (subscriptionType.oneTime) {
      const existingSubscription = await this.prisma.subscription.findFirst({
        where: {
          user: { id: user.id },
          subscriptionType: { id: subscriptionType.id },
        },
        orderBy: { expiredDate: 'desc' },
        include: { subscriptionType: true },
      });

      if (existingSubscription) {
        throw new Error('You already have an this subscription');
      }
    }
    const transaction = await this.prisma.transaction.create({
      data: {
        type: createTransactionDto.type,
        transactionId: createTransactionDto.transactionId,
        userId: user.id,
        subscriptionTypeId: subscriptionType.id,
        price: createTransactionDto.price,
        paymentType: createTransactionDto.paymentType,
        status: createTransactionDto.status || TransactionStatus.Created,
      },
    });

    if (transaction.status === TransactionStatus.Paid) {
      await this.transactionPaid(transaction);
    }

    return transaction;
  }

  async findAll(dto: FindAllTransactionDto) {
    const {
      limit = 10,
      page = 1,
      userId,
      paymentType,
      type,
      subscriptionTypeId,
      phone,
      username,
      oneTime,
      maxPrice,
      minPrice,
    } = dto;

    const where: Prisma.TransactionWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (minPrice) {
      where.price = { gte: minPrice };
    }

    if (maxPrice) {
      where.price = { lte: maxPrice };
    }

    if (oneTime !== undefined) {
      where.subscriptionType = { oneTime };
    }

    if (phone) {
      where.user.phoneNumber = { contains: phone };
    }

    if (username) {
      where.user.username = { contains: username };
    }

    if (subscriptionTypeId) {
      where.subscriptionTypeId = subscriptionTypeId;
    }

    if (paymentType) {
      where.paymentType = paymentType;
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
          subscriptionType: true,
        },
      }),
      this.prisma.transaction.count({
        where,
      }),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOneByUserId(userId: number, dto: PaginationDto) {
    const { limit = 10, page = 1 } = dto;

    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where: { user: { id: userId } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where: { user: { id: userId } } }),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOneByTransactionId(transactionId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { transactionId: transactionId },
      include: {
        user: true,
        subscriptionType: true,
      },
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async findOne(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
        subscriptionType: true,
      },
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    let transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction = await this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
      include: {
        user: true,
        subscriptionType: true,
      },
    });

    if (updateTransactionDto.status === TransactionStatus.Paid) {
      await this.transactionPaid(transaction);
    }

    return transaction;
  }

  async transactionPaid(transaction: Transaction) {
    const subscriptionType = await this.subscriptionTypeService.findOne(
      transaction.subscriptionTypeId,
    );
    await this.subscriptionService.create({
      subscriptionTypeId: subscriptionType.id,
      transactionId: transaction.id,
      userId: transaction.userId,
    });

    return transaction;
  }

  async remove(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return await this.prisma.transaction.delete({
      where: { id },
      include: {
        user: true,
        subscriptionType: true,
      },
    });
  }
}
