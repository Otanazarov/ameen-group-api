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
