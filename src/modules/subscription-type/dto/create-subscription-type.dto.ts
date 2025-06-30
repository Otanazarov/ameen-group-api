import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubscriptionTypeDto {
  @ApiProperty({ example: 20000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: '1 oylik obuna' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Bu obuna sizga 1 oy davomida kanalga kirish imkonini beradi.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 30 })
  @IsNotEmpty()
  @IsNumber()
  expireDays: number;
}
