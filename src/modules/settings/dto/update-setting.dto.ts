import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateSettingDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	aboutAminGroup?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	contactMessage?: string;

	@ApiPropertyOptional({
		example:
			"! Ogohlantirish! Sizning obunangiz {{expireDate}} da tugaydi. ⏳ {{daysLeft}} kun qoldi.",
	})
	@IsOptional()
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
