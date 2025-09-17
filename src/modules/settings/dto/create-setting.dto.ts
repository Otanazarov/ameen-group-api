import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSettingDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	aboutAminGroup: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	contactMessage: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	startMessage: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	alertMessage?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	aboutAminGroupImageId?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	contactImageId?: number;
}
