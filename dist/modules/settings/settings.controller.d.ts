import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    findOne(): Promise<{
        aboutAminGroupImage: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            size: number;
            mimetype: string;
            hash: string;
        };
        aboutKozimxonTorayevImage: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            size: number;
            mimetype: string;
            hash: string;
        };
    } & {
        id: number;
        aboutAminGroup: string;
        aboutKozimxonTorayev: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        aboutKozimxonTorayevImageId: number | null;
    }>;
    update(updateSettingDto: UpdateSettingDto): Promise<{
        id: number;
        aboutAminGroup: string;
        aboutKozimxonTorayev: string;
        alertMessage: string;
        aboutAminGroupImageId: number | null;
        aboutKozimxonTorayevImageId: number | null;
    }>;
}
