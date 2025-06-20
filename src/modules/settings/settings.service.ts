import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllSettingsDto } from './dto/findAll-settings.dto';
import { HttpError } from 'src/common/exception/http.error';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
    const settings = await this.findOne()
    if (!settings) this.create({ aboutAminGroup: "info1", aboutKozimxonTorayev: "info2" })
  }

  async create(createSettingDto: CreateSettingDto) {
    const settings = await this.prisma.settings.create({
      data: createSettingDto,
    });
    return settings;
  }

  // async findAll(dto: FindAllSettingsDto) {
  //   const { limit = 10, page = 1 } = dto;

  //   const [data, total] = await this.prisma.$transaction([
  //     this.prisma.settings.findMany({
  //       skip: (page - 1) * limit,
  //       take: limit,
  //       orderBy: {
  //         id: 'asc',
  //       },
  //     }),
  //     this.prisma.settings.count(),
  //   ]);

  //   return {
  //     total,
  //     page,
  //     limit,
  //     data,
  //   };
  // }

  async findOne() {
    const settings = await this.prisma.settings.findUnique({
      where: { id: 1 },
    });
    return settings;
  }

  async update(updateSettingDto: UpdateSettingDto) {
    const existing = await this.prisma.settings.findUnique({
      where: { id: 1 },
    });

    if (!existing) {
      throw new Error(`Settings with id ${1} not found`);
    }

    const updated = await this.prisma.settings.update({
      where: { id: 1 },
      data: updateSettingDto,
    });

    return updated;
  }

  // async remove(id: number) {
  //   const settings = await this.prisma.settings.findUnique({
  //     where: { id: id },
  //   });
  //   if (!settings) {
  //     throw HttpError({ code: 'Settings not found' });
  //   }
  // }
}
