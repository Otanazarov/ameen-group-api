import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllTransactionDto } from './dto/findAll-transaction.dto';
import { Prisma, Transaction, TransactionStatus } from '@prisma/client';
import { SubscriptionService } from '../subscription/subscription.service';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';

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

    const transaction = await this.prisma.transaction.create({
      data: {
        type: createTransactionDto.type,
        userId: createTransactionDto.userId,
        price: createTransactionDto.price,
        subscriptionTypeId: createTransactionDto.subscriptionTypeId,
        paymentType: createTransactionDto.paymentType,
        status: createTransactionDto.status || TransactionStatus.Created,
      },
      include: {
        user: true,
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
      subscriptionTypeId,
    } = dto;

    const where: Prisma.TransactionWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (subscriptionTypeId) {
      where.subscriptionTypeId = subscriptionTypeId;
    }

    if (paymentType) {
      where.paymentType = paymentType;
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
