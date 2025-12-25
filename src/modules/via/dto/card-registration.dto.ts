import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, Length, IsInt } from "class-validator";

export class RegisterCardDto {
    @ApiProperty({ example: "5614684090151111" })
    @IsNotEmpty()
    @IsString()
    @Length(16, 16)
    pan: string;

    @ApiProperty({ example: "04" })
    @IsNotEmpty()
    @IsString()
    @Length(2, 2)
    expMonth: string;

    @ApiProperty({ example: "26" })
    @IsNotEmpty()
    @IsString()
    @Length(2, 2)
    expYear: string;

    @ApiProperty({ example: "998970000000" })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    phone: string;
}

export class VerifyCardDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @ApiProperty({ example: "34431eb766424ace9234bf0d35c86bdb" })
    @IsNotEmpty()
    @IsString()
    verifyId: string;

    @ApiProperty({ example: "123321" })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    verifyCode: string;
}
