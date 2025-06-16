import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class FindAllUserDto extends PaginationDto {
    @ApiPropertyOptional({ example: 'John' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '1234567890' })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}