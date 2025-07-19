"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const refresh_token_version_store_1 = require("../../common/auth/refresh-token-version.store");
const role_enum_1 = require("../../common/auth/roles/role.enum");
const access_token_version_store_1 = require("../../common/auth/access-token-version.store");
const config_1 = require("../../common/config");
const http_error_1 = require("../../common/exception/http.error");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const admin = await this.prisma.admin.count();
        if (admin == 0) {
            await this.create({ name: 'admin', password: 'admin' });
        }
    }
    async create(createAdminDto) {
        const existingAdmin = await this.prisma.admin.findFirst({
            where: { name: createAdminDto.name },
        });
        if (existingAdmin) {
            throw (0, http_error_1.HttpError)({ code: 'Admin with this name already exists' });
        }
        const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
        createAdminDto.password = hashedPassword;
        const admin = await this.prisma.admin.create({ data: createAdminDto });
        delete admin.password;
        return admin;
    }
    async login(dto) {
        const { name, password } = dto;
        const admin = await this.prisma.admin.findFirst({
            where: { name: name },
        });
        if (!admin) {
            throw (0, http_error_1.HttpError)({ code: 'Admin not found' });
        }
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            throw (0, http_error_1.HttpError)({ code: 'Invalid credentials' });
        }
        (0, access_token_version_store_1.incrementAccessTokenVersion)(admin.id.toString());
        (0, refresh_token_version_store_1.incrementRefreshTokenVersion)(admin.id.toString());
        const tokenVersion = (0, access_token_version_store_1.getTokenVersion)(admin.id.toString());
        const refreshTokenVersion = (0, refresh_token_version_store_1.getRefreshTokenVersion)(admin.id.toString());
        const [accessToken, refreshToken] = [
            (0, jsonwebtoken_1.sign)({ id: admin.id, role: role_enum_1.Role.Admin, tokenVersion }, config_1.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '10h',
            }),
            (0, jsonwebtoken_1.sign)({ id: admin.id, role: role_enum_1.Role.Admin, refreshTokenVersion }, config_1.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '5d',
            }),
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
    async refresh(dto) {
        const token = dto.refreshToken;
        const adminData = (0, jsonwebtoken_1.verify)(token, config_1.env.REFRESH_TOKEN_SECRET);
        if (!adminData)
            throw (0, http_error_1.HttpError)({ code: 'LOGIN_FAILED' });
        const admin = await this.prisma.admin.findUnique({
            where: { id: adminData.id },
        });
        if (!admin) {
            throw (0, http_error_1.HttpError)({ code: 'Admin not found' });
        }
        if (!admin.refreshToken) {
            throw (0, http_error_1.HttpError)({ code: 'REFRESH_TOKEN_NOT_FOUND' });
        }
        const isRefreshTokenValid = await bcrypt.compare(dto.refreshToken, admin.refreshToken);
        if (!isRefreshTokenValid) {
            throw (0, http_error_1.HttpError)({ code: 'INVALID_REFRESH_TOKEN' });
        }
        const currentRefreshVersion = (0, refresh_token_version_store_1.getRefreshTokenVersion)(admin.id.toString());
        if (adminData.refreshTokenVersion !== currentRefreshVersion) {
            throw (0, http_error_1.HttpError)({ code: 'TOKEN_INVALIDATED' });
        }
        (0, access_token_version_store_1.incrementAccessTokenVersion)(admin.id.toString());
        const currentTokenVersion = (0, access_token_version_store_1.getTokenVersion)(admin.id.toString());
        const accessToken = (0, jsonwebtoken_1.sign)({
            id: admin.id,
            tokenVersion: currentTokenVersion,
            role: role_enum_1.Role.Admin,
        }, config_1.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });
        return { accessToken };
    }
    async logout(id) {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin) {
            throw (0, http_error_1.HttpError)({ code: 'Admin not found' });
        }
        (0, access_token_version_store_1.incrementAccessTokenVersion)(admin.id.toString());
        (0, refresh_token_version_store_1.incrementRefreshTokenVersion)(admin.id.toString());
        await this.prisma.admin.update({
            where: { id },
            data: { refreshToken: null },
        });
        return { message: 'Logged out successfully' };
    }
    async findAll(dto) {
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
    async findOne(id) {
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
            throw (0, http_error_1.HttpError)({ code: 'Admin not found' });
        }
        return admin;
    }
    async update(id, dto) {
        const admin = await this.prisma.admin.findUnique({ where: { id } });
        if (!admin)
            throw (0, http_error_1.HttpError)({ code: 'Admin not found' });
        const updateData = {
            name: dto.name || admin.name,
        };
        if (dto.newPassword) {
            if (!dto.oldPassword)
                throw (0, http_error_1.HttpError)({ code: 'The previous password is required' });
            const match = await bcrypt.compare(dto.oldPassword, admin.password);
            if (!match)
                throw (0, http_error_1.HttpError)({ code: 'Wrong password' });
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
    async me(id) {
        return this.findOne(id);
    }
    async remove(id) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: id },
        });
        if (!admin) {
            throw (0, http_error_1.HttpError)({ code: 'Admin not found' });
        }
        return await this.prisma.admin.delete({
            where: { id: id },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map