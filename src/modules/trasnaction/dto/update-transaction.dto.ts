import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentType, TransactionStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { IsId } from "src/common/dtos/id.dto";
import { IsName } from "src/common/dtos/name.dto";

export class UpdateTransactionDto {
	@IsName(false)
	transactionId?: string;

	@IsId(false)
	userId?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsEnum(TransactionStatus)
	status?: TransactionStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	price?: number;

	@ApiPropertyOptional({ enum: PaymentType })
	@IsOptional()
	@IsEnum(PaymentType)
	paymentType?: PaymentType;

	@IsId(false)
	subscriptionTypeId?: number;
}
