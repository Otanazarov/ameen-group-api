import { IsName } from 'src/common/dtos/name.dto';
import { IsPassword } from 'src/common/dtos/password.dto';

export class UpdateAdminDto {
  @IsName(false)
  name?: string;

  @IsPassword(false)
  newPassword?: string;

  @IsPassword(false)
  oldPassword?: string;
}
