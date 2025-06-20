import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { FindAllSettingsDto } from './dto/findAll-settings.dto';
import { ApiTags } from '@nestjs/swagger';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // @Post()
  // @DecoratorWrapper('Create Settings', true, [Role.Admin])
  // create(@Body() createSettingDto: CreateSettingDto) {
  //   return this.settingsService.create(createSettingDto);
  // }

  // @Get()
  // @DecoratorWrapper('FindAll Settings')
  // findAll(@Query() dto: FindAllSettingsDto) {
  //   return this.settingsService.findAll(dto);
  // }

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

  // @Delete(':id')
  // @DecoratorWrapper('Remove Settings', true, [Role.Admin])
  // remove(@Param('id') id: string) {
  //   return this.settingsService.remove(+id);
  // }
}
