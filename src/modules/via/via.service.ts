import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { env } from "src/common/config";
import { viaApi } from "src/common/utils/axios";
import { CardInfoRequest, CardInfoResponse, ContractInfoResponse, CreateContractRequest, CreateContractResponse, DeactivateResponse, DeleteResponse, RegisterCardRequest, RegisterCardResponse, VerifyCardRequest, VerifyCardResponse } from "./via.interface";

@Injectable()
export class ViaService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    private get headers() {
        console.log(env.VIA_CLIENT_ID, env.VIA_CLIENT_SECRET);

        return {
            "client-id": env.VIA_CLIENT_ID || 'ameen-group',
            "client-secret": env.VIA_CLIENT_SECRET || '0b65ce4e0bf6432483dd6af5ad45939a1766378587356',
        };
    }

    async createContract(dto: CreateContractRequest): Promise<CreateContractResponse> {
        try {
            const { data } = await viaApi.post<CreateContractResponse>(
                "/partner/subscription/contract/create",
                dto,
                { headers: this.headers },
            );
            return data;
        } catch (error) {
            console.error("Via createContract error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Via xizmatida xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }

    async registerCard(dto: RegisterCardRequest): Promise<RegisterCardResponse> {
        try {
            const { data } = await viaApi.post<RegisterCardResponse>(
                "/partner/card/register",
                dto,
                { headers: this.headers },
            );
            return data;
        } catch (error) {
            console.error("Via registerCard error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Karta ro'yxatdan o'tkazishda xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }

    async verifyCard(dto: VerifyCardRequest): Promise<VerifyCardResponse> {
        try {
            const { userId, ...verifyDto } = dto;
            const { data } = await viaApi.post<VerifyCardResponse>(
                "/partner/card/register/verify",
                verifyDto,
                { headers: this.headers },
            );

            // Kartani databaseda saqlash
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
        } catch (error) {
            console.error("Via verifyCard error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Kartani tasdiqlashda xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }

    async activateContract(contractId: string): Promise<CreateContractResponse> {
        try {
            const { data } = await viaApi.patch<CreateContractResponse>(
                `/partner/subscription/contract/activate/${contractId}`,
                {},
                { headers: this.headers },
            );
            return data;
        } catch (error) {
            console.error("Via activateContract error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Kontraktni faollashtirishda xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }

    async deactivateContract(contractId: string): Promise<DeactivateResponse> {
        try {
            const { data } = await viaApi.delete<DeactivateResponse>(
                `/partner/subscription/contract/deactivate/${contractId}`,
                { headers: this.headers },
            );
            return data;
        } catch (error) {
            console.error("Via deactivateContract error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Kontraktni bekor qilishda xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }

    async deleteContract(contractId: string): Promise<DeleteResponse> {
        try {
            const { data } = await viaApi.delete<DeleteResponse>(
                `/partner/subscription/contract/delete/${contractId}`,
                { headers: this.headers },
            );
            return data;
        } catch (error) {
            console.error("Via deleteContract error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Kontraktni o'chirishda xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }

    async getContractInfo(contractId: string): Promise<ContractInfoResponse> {
        try {
            const { data } = await viaApi.get<ContractInfoResponse>(
                `/partner/subscription/contract/info/${contractId}`,
                { headers: this.headers },
            );
            return data;
        } catch (error) {
            console.error("Via getContractInfo error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Kontrakt ma'lumotlarini olishda xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }

    async getCardInfoByToken(dto: CardInfoRequest): Promise<CardInfoResponse> {
        try {
            const { data } = await viaApi.post<CardInfoResponse>(
                "/partner/card/info-by-token",
                dto,
                { headers: this.headers },
            );
            return data;
        } catch (error) {
            console.error("Via getCardInfoByToken error:", error.response?.data || error.message);
            throw new HttpException(
                error.response?.data?.error?.message?.uz || "Karta ma'lumotlarini olishda xatolik yuz berdi",
                error.response?.status || 500,
            );
        }
    }
}