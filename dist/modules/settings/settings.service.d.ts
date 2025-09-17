import { OnModuleInit } from "@nestjs/common";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { PrismaService } from "../prisma/prisma.service";
export declare class SettingsService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    create(createSettingDto: CreateSettingDto): Promise<{
        id: number;
        aboutAminGroup: string;
        contactMessage: string;
        startMessage: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        contactImageId: number | null;
    }>;
    findOne(): Promise<{
        aboutAminGroupImage: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            mimetype: string;
            size: number;
            hash: string;
        };
        contactImage: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            mimetype: string;
            size: number;
            hash: string;
        };
    } & {
        id: number;
        aboutAminGroup: string;
        contactMessage: string;
        startMessage: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        contactImageId: number | null;
    }>;
    update(updateSettingDto: UpdateSettingDto): Promise<{
        id: number;
        aboutAminGroup: string;
        contactMessage: string;
        startMessage: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        contactImageId: number | null;
    }>;
}
