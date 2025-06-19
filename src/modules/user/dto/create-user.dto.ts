import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client'; // agar enumlar kerak bo‘lsa

export class CreateUserDto {
  @ApiProperty({ example: 'Otabek' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Otanazarov' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '998901234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 5390012345 }) // Telegram ID lar katta bo‘ladi
  @IsString()
  @IsNotEmpty()
  telegramId: string;
}
