import { IsId } from "src/common/dtos/id.dto";

export class CreateAtmosDto {
	@IsId()
	userId: number;

	@IsId()
	subscriptionTypeId: number;
}
