import { IsName } from 'src/common/dtos/name.dto';
import { IsPassword } from 'src/common/dtos/password.dto';

export class CreateAdminDto {
  @IsName()
  name: string;

  @IsPassword()
  password: string;
}
