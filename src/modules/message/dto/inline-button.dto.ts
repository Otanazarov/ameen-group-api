import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export enum InlineButtonActions {
  SUBSCRIPTONS = 'subscriptons',
  BUY_SUBSCRIPTON = 'subscribe-',
  ABOUT_US = 'about_us',
  ABOUT_OWNER = 'about_owner',
  MY_SUBSCRIPTION = 'my_subscriptions',
}

export class InlineButtonDto {
  @ApiProperty({ description: 'Text displayed on the button' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'URL to open when button is clicked' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'action to take when button is pressed' })
  @IsOptional()
  @IsString()
  data?: InlineButtonActions;
}
