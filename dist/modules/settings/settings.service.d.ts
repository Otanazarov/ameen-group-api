import { OnModuleInit } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    create(createSettingDto: CreateSettingDto): Promise<{
        id: number;
        aboutAminGroup: string;
        aboutKozimxonTorayev: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        aboutKozimxonTorayevImageId: number | null;
        startMessage: string;
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
        aboutKozimxonTorayevImage: {
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
        aboutKozimxonTorayev: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        aboutKozimxonTorayevImageId: number | null;
        startMessage: string;
    }>;
    update(updateSettingDto: UpdateSettingDto): Promise<{
        id: number;
        aboutAminGroup: string;
        aboutKozimxonTorayev: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        aboutKozimxonTorayevImageId: number | null;
        startMessage: string;
    }>;
}
