import { ApiProperty } from "@nestjs/swagger";

export class CreateContractRequestDto {
    @ApiProperty()
    userId: number;
    @ApiProperty()
    subscriptionTypeId: number;
    @ApiProperty()
    cardToken: string;
}