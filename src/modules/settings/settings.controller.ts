import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @DecoratorWrapper('FindOne Settings')
  findOne() {
    return this.settingsService.findOne();
  }

  @Patch()
  @DecoratorWrapper('Update Settings', true, [Role.Admin])
  update(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(updateSettingDto);
  }
}
