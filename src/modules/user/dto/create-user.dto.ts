import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'username' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;
}
