import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import {
  getRefreshTokenVersion,
  incrementRefreshTokenVersion,
} from 'src/common/auth/refresh-token-version.store';
import { Role } from 'src/common/auth/roles/role.enum';
import {
  getTokenVersion,
  incrementAccessTokenVersion,
} from 'src/common/auth/access-token-version.store';
import { env } from 'src/common/config';
import { HttpError } from 'src/common/exception/http.error';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FindAllAdminQueryDto } from './dto/findAll-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RefreshAdminDto } from './dto/refresh-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}
  async onModuleInit() {
    const admin = await this.prisma.admin.count();
    if (admin == 0) {
      await this.create({ name: 'admin', password: 'admin' });
    }
  }

  async create(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findFirst({
      where: { name: createAdminDto.name },
    });
    if (existingAdmin) {
      throw HttpError({ code: 'Admin with this name already exists' });
    }
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    createAdminDto.password = hashedPassword;

    const admin = await this.prisma.admin.create({ data: createAdminDto });
    delete admin.password;
    return admin;
  }

  async login(dto: LoginAdminDto) {
    const { name, password } = dto;
    const admin = await this.prisma.admin.findFirst({
      where: { name: name },
    });
    if (!admin) {
      throw HttpError({ code: 'Admin not found' });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      throw HttpError({ code: 'Invalid credentials' });
    }
    incrementAccessTokenVersion(admin.id.toString());
    incrementRefreshTokenVersion(admin.id.toString());

    const tokenVersion = getTokenVersion(admin.id.toString());
    const refreshTokenVersion = getRefreshTokenVersion(admin.id.toString());

    const [accessToken, refreshToken] = [
      sign(
        { id: admin.id, role: Role.Admin, tokenVersion },
        env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '10h',
        },
      ),
      sign(
        { id: admin.id, role: Role.Admin, refreshTokenVersion },
        env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '5d',
        },
      ),
    ];

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    });

    delete admin.password;
    return {
      admin,
      accessToken,
      refreshToken,
    };
  }

  async refresh(dto: RefreshAdminDto) {
    const token = dto.refreshToken;

    const adminData = verify(token, env.REFRESH_TOKEN_SECRET) as {
      id: number;
      refreshTokenVersion: string;
    };

    if (!adminData) throw HttpError({ code: 'LOGIN_FAILED' });

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminData.id },
    });

    if (!admin) {
      throw HttpError({ code: 'Admin not found' });
    }

    if (!admin.refreshToken) {
      throw HttpError({ code: 'REFRESH_TOKEN_NOT_FOUND' });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      dto.refreshToken,
      admin.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw HttpError({ code: 'INVALID_REFRESH_TOKEN' });
    }

    const currentRefreshVersion = getRefreshTokenVersion(admin.id.toString());
    if (adminData.refreshTokenVersion !== currentRefreshVersion) {
      throw HttpError({ code: 'TOKEN_INVALIDATED' });
    }

    incrementAccessTokenVersion(admin.id.toString());
    const currentTokenVersion = getTokenVersion(admin.id.toString());

    const accessToken = sign(
      {
        id: admin.id,
        tokenVersion: currentTokenVersion,
        role: Role.Admin,
      },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10h' },
    );

    return { accessToken };
  }

  async logout(id: number) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw HttpError({ code: 'Admin not found' });
    }
    incrementAccessTokenVersion(admin.id.toString());
    incrementRefreshTokenVersion(admin.id.toString());

    // Clear refresh token from database
    await this.prisma.admin.update({
      where: { id },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }

  async findAll(dto: FindAllAdminQueryDto) {
    const { limit = 10, page = 1, name } = dto;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.admin.findMany({
        where: {
          name: {
            contains: name?.trim() || '',
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.admin.count({
        where: {
          name: {
            contains: name?.trim() || '',
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!admin) {
      throw HttpError({ code: 'Admin not found' });
    }
    return admin;
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw HttpError({ code: 'Admin not found' });

    const updateData: any = {
      name: dto.name || admin.name,
    };

    if (dto.newPassword) {
      if (!dto.oldPassword)
        throw HttpError({ code: 'The previous password is required' });

      const match = await bcrypt.compare(dto.oldPassword, admin.password);
      if (!match) throw HttpError({ code: 'Wrong password' });

      updateData.password = await bcrypt.hash(dto.newPassword, 10);
    }

    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedAdmin;
  }

  async me(id: number) {
    return this.findOne(id);
  }

  async remove(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: id },
    });
    if (!admin) {
      throw HttpError({ code: 'Admin not found' });
    }
    return await this.prisma.admin.delete({
      where: { id: id },
    });
  }
}
