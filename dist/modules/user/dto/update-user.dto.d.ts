import { UserStatus } from '@prisma/client';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    inGroup?: boolean;
    email?: string;
    status?: UserStatus;
    username?: string;
    lastActiveAt?: Date;
}
