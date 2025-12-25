import { PrismaService } from "../prisma/prisma.service";
import { CardInfoRequest, CardInfoResponse, ContractInfoResponse, CreateContractRequest, CreateContractResponse, DeactivateResponse, DeleteResponse, RegisterCardRequest, RegisterCardResponse, VerifyCardRequest, VerifyCardResponse } from "./via.interface";
export declare class ViaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get headers();
    createContract(dto: CreateContractRequest): Promise<CreateContractResponse>;
    registerCard(dto: RegisterCardRequest): Promise<RegisterCardResponse>;
    verifyCard(dto: VerifyCardRequest): Promise<VerifyCardResponse>;
    activateContract(contractId: string): Promise<CreateContractResponse>;
    deactivateContract(contractId: string): Promise<DeactivateResponse>;
    deleteContract(contractId: string): Promise<DeleteResponse>;
    getContractInfo(contractId: string): Promise<ContractInfoResponse>;
    getCardInfoByToken(dto: CardInfoRequest): Promise<CardInfoResponse>;
}
