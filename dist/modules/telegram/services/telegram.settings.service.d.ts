import { UserService } from 'src/modules/user/user.service';
import { Context } from '../Context.type';
import { TelegramSenderService } from './telegram.sender.service';
export declare class TelegramSettingsService {
    private readonly userService;
    private readonly senderService;
    constructor(userService: UserService, senderService: TelegramSenderService);
    handleEdit(ctx: Context): Promise<boolean>;
}
