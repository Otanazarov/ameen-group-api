import { MessageStatus } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
export declare class FindAllMessageUserDto extends PaginationDto {
    status: MessageStatus;
}
