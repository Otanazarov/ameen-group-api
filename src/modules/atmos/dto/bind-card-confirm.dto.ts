import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class BindCardConfirmDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	transaction_id: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	otp: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	userId: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	subscriptionTypeId?: number;
}
