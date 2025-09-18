import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { IsId } from "src/common/dtos/id.dto";

export class BindCardInitDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	card_number: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	expiry: string;
}
