import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @DecoratorWrapper('User findAll', true, [Role.Admin])
  findAll(@Query() dto: FindAllUserDto) {
    return this.userService.findAll(dto);
  }

  @Get(':id')
  @DecoratorWrapper('User findOne', true, [Role.Admin])
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('User update', true, [Role.Admin])
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }
}
