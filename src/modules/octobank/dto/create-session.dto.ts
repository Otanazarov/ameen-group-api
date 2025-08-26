import { IsId } from "src/common/dtos/id.dto";

export class CreateSessionDto {
	@IsId()
	userId: number;

	@IsId()
	subscriptionTypeId: number;
}
