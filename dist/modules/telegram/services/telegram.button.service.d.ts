import { OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
export declare class TelegramButtonService implements OnModuleInit {
    private readonly prismaService;
    private buttonMap;
    constructor(prismaService: PrismaService);
    onModuleInit(): Promise<void>;
    loadButtons(): Promise<void>;
    getButtonData(text: string): string | undefined;
    get allButtons(): import(".prisma/client").Prisma.PrismaPromise<{
        default: boolean;
        id: number;
        data: string | null;
        url: string | null;
        text: string;
    }[]>;
}
