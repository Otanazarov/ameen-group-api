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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const settings = await this.findOne();
        if (!settings)
            this.create({
                aboutAminGroup: "info1",
                contactMessage: "info2",
                startMessage: "info3",
            });
    }
    async create(createSettingDto) {
        const settings = await this.prisma.settings.create({
            data: createSettingDto,
        });
        return settings;
    }
    async findOne() {
        const settings = await this.prisma.settings.findUnique({
            where: { id: 1 },
            include: {
                aboutAminGroupImage: true,
                contactImage: true,
            },
        });
        return settings;
    }
    async update(updateSettingDto) {
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
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map