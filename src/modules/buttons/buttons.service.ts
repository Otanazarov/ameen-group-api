import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateButtonDto } from './dto/create-buttons.dto';
import { UpdateButtonDto } from './dto/update-buttons.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllButtonDto } from './dto/findAll-buttons.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ButtonsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const defaultButtons = [
      {
        text: "📝 Obuna Bo'lish",
        data: 'subscribe_menu',
        default: true,
      },
      {
        text: '📋 Obunalarim',
        data: 'my_subscriptions',
        default: true,
      },
      {
        text: 'ℹ️ Biz haqimizda',
        data: 'about_us',
        default: true,
      },
      {
        text: "👨‍🏫 Kozimxon To'rayev haqida",
        data: 'about_owner',
        default: true,
      },
      {
        text: '⚙️ Sozlamalar',
        data: 'settings',
        default: true,
      },
    ];

    for (const button of defaultButtons) {
      const existingButton = await this.prisma.inlineButton.findFirst({
        where: { data: button.data },
      });
      if (!existingButton) {
        await this.prisma.inlineButton.create({ data: button });
      }
    }
  }

  async create(createButtonDto: CreateButtonDto) {
    const buttons = await this.prisma.inlineButton.create({
      data: { ...createButtonDto, default: false },
    });
    return buttons;
  }

  async findAll(dto: FindAllButtonDto) {
    const { page = 1, limit = 10, text } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.InlineButtonWhereInput = {
      text: text ? { contains: text, mode: 'insensitive' } : undefined,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.inlineButton.findMany({
        where,
        skip,
        take: limit,
        orderBy: { text: 'asc' },
      }),
      this.prisma.inlineButton.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOne(id: number) {
    const button = await this.prisma.inlineButton.findUnique({
      where: { id },
    });
    if (!button) {
      throw new Error(`Button with id ${id} not found`);
    }
    return button;
  }

  async update(id: number, updateButtonDto: UpdateButtonDto) {
    const updated = await this.prisma.inlineButton.update({
      where: { id },
      data: updateButtonDto,
    });
    return updated;
  }

  async remove(id: number) {
    await this.prisma.inlineButton.delete({ where: { id, default: false } });
    return { message: 'Button removed successfully' };
  }
}
