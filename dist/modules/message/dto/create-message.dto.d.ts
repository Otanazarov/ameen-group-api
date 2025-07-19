import { UserStatus } from '@prisma/client';
import { ButtonPlacementDto } from './button-placement.dto';
export declare class CreateMessageDto {
    text: string;
    userIds?: number[];
    status?: UserStatus;
    subscriptionTypeId?: number;
    fileIds?: number[];
    buttonPlacements?: ButtonPlacementDto[];
}
