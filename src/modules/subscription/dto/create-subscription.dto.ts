import { IsId } from 'src/common/dtos/id.dto';

export class CreateSubscriptionDto {
  @IsId()
  userId: number;

  @IsId(true)
  transactionId: number;

  @IsId()
  subscriptionTypeId: number;
}
