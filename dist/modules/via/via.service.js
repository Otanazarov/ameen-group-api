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
exports.ViaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("../../common/config");
const axios_1 = require("../../common/utils/axios");
let ViaService = class ViaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get headers() {
        console.log(config_1.env.VIA_CLIENT_ID, config_1.env.VIA_CLIENT_SECRET);
        return {
            "client-id": config_1.env.VIA_CLIENT_ID || 'ameen-group',
            "client-secret": config_1.env.VIA_CLIENT_SECRET || '0b65ce4e0bf6432483dd6af5ad45939a1766378587356',
        };
    }
    async createContract(dto) {
        try {
            const { data } = await axios_1.viaApi.post("/partner/subscription/contract/create", dto, { headers: this.headers });
            return data;
        }
        catch (error) {
            console.error("Via createContract error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Via xizmatida xatolik yuz berdi", error.response?.status || 500);
        }
    }
    async registerCard(dto) {
        try {
            const { data } = await axios_1.viaApi.post("/partner/card/register", dto, { headers: this.headers });
            return data;
        }
        catch (error) {
            console.error("Via registerCard error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Karta ro'yxatdan o'tkazishda xatolik yuz berdi", error.response?.status || 500);
        }
    }
    async verifyCard(dto) {
        try {
            const { userId, ...verifyDto } = dto;
            const { data } = await axios_1.viaApi.post("/partner/card/register/verify", verifyDto, { headers: this.headers });
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (user) {
                const currentCards = Array.isArray(user.cards) ? user.cards : [];
                await this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        cards: [...currentCards, data.token],
                    },
                });
            }
            return data;
        }
        catch (error) {
            console.error("Via verifyCard error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Kartani tasdiqlashda xatolik yuz berdi", error.response?.status || 500);
        }
    }
    async activateContract(contractId) {
        try {
            const { data } = await axios_1.viaApi.patch(`/partner/subscription/contract/activate/${contractId}`, {}, { headers: this.headers });
            return data;
        }
        catch (error) {
            console.error("Via activateContract error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Kontraktni faollashtirishda xatolik yuz berdi", error.response?.status || 500);
        }
    }
    async deactivateContract(contractId) {
        try {
            const { data } = await axios_1.viaApi.delete(`/partner/subscription/contract/deactivate/${contractId}`, { headers: this.headers });
            return data;
        }
        catch (error) {
            console.error("Via deactivateContract error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Kontraktni bekor qilishda xatolik yuz berdi", error.response?.status || 500);
        }
    }
    async deleteContract(contractId) {
        try {
            const { data } = await axios_1.viaApi.delete(`/partner/subscription/contract/delete/${contractId}`, { headers: this.headers });
            return data;
        }
        catch (error) {
            console.error("Via deleteContract error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Kontraktni o'chirishda xatolik yuz berdi", error.response?.status || 500);
        }
    }
    async getContractInfo(contractId) {
        try {
            const { data } = await axios_1.viaApi.get(`/partner/subscription/contract/info/${contractId}`, { headers: this.headers });
            return data;
        }
        catch (error) {
            console.error("Via getContractInfo error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Kontrakt ma'lumotlarini olishda xatolik yuz berdi", error.response?.status || 500);
        }
    }
    async getCardInfoByToken(dto) {
        try {
            const { data } = await axios_1.viaApi.post("/partner/card/info-by-token", dto, { headers: this.headers });
            return data;
        }
        catch (error) {
            console.error("Via getCardInfoByToken error:", error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.error?.message?.uz || "Karta ma'lumotlarini olishda xatolik yuz berdi", error.response?.status || 500);
        }
    }
};
exports.ViaService = ViaService;
exports.ViaService = ViaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ViaService);
//# sourceMappingURL=via.service.js.map