import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsArray, IsJSON } from 'class-validator';

export class CreateSubscriptionTypeDto {
  @ApiProperty({ example: 20000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: '1 oylik obuna' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Bu obuna sizga 1 oy davomida kanalga kirish imkonini beradi.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: [123456, 654321],
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  telegramTopicIds: number[];
}
