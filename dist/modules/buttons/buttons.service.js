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
exports.ButtonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ButtonsService = class ButtonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const defaultButtons = [
            {
                text: "Menejer bilan a'loqa",
                data: "contact",
                default: true,
            },
            {
                text: "Kanal haqida",
                data: "about",
                default: true,
            },
            {
                text: "Profil",
                data: "settings",
                default: true,
            },
            {
                text: "🔄 Botni yangilash",
                data: "start",
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
    async create(createButtonDto) {
        const buttons = await this.prisma.inlineButton.create({
            data: { ...createButtonDto, default: false },
        });
        return buttons;
    }
    async findAll(dto) {
        const { page = 1, limit = 10, text } = dto;
        const skip = (page - 1) * limit;
        const where = {
            text: text ? { contains: text, mode: "insensitive" } : undefined,
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.inlineButton.findMany({
                where,
                skip,
                take: limit,
                orderBy: { text: "asc" },
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
    async findOne(id) {
        const button = await this.prisma.inlineButton.findUnique({
            where: { id },
        });
        if (!button) {
            throw new Error(`Button with id ${id} not found`);
        }
        return button;
    }
    async update(id, updateButtonDto) {
        const updated = await this.prisma.inlineButton.update({
            where: { id },
            data: updateButtonDto,
        });
        return updated;
    }
    async remove(id) {
        await this.prisma.inlineButton.delete({ where: { id, default: false } });
        return { message: "Button removed successfully" };
    }
};
exports.ButtonsService = ButtonsService;
exports.ButtonsService = ButtonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ButtonsService);
//# sourceMappingURL=buttons.service.js.map