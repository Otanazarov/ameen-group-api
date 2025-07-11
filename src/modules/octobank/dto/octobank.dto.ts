import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export enum OctobankStatus {
  created = 'created',
  canceled = 'canceled',
  wait_user_action = 'wait_user_action',
  waiting_for_capture = 'waiting_for_capture',
  succeeded = 'succeeded',
}

export class OctobankDto {
  @IsUUID()
  shop_transaction_id: string;

  @IsUUID()
  octo_payment_UUID: string;

  @IsString()
  status: OctobankStatus;

  @IsString()
  signature: string;

  @IsString()
  hash_key: string;

  @IsNumber()
  total_sum: number;

  @IsNumber()
  transfer_sum: number;

  @IsNumber()
  refunded_sum: number;

  @IsString()
  card_country: string;

  @IsString()
  maskedPan: string;

  @IsNumber()
  rrn: number;

  @IsNumber()
  riskLevel: number;

  @IsDateString()
  payed_time: string;

  @IsString()
  card_type: string;
}
