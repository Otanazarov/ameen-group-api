import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
import { ButtonsService } from './buttons.service';
import { CreateButtonDto } from './dto/create-buttons.dto';
import { UpdateButtonDto } from './dto/update-buttons.dto';
import { FindAllButtonDto } from './dto/findAll-buttons.dto';

@Controller('buttons')
@ApiTags('Buttons')
export class ButtonsController {
  constructor(private readonly buttonsService: ButtonsService) {}

  @Post()
  @DecoratorWrapper('Create Button', true, [Role.Admin])
  create(@Body() createButtonDto: CreateButtonDto) {
    return this.buttonsService.create(createButtonDto);
  }

  @Get()
  @DecoratorWrapper('Find All Buttons', true, [Role.Admin])
  findAll(@Query() dto: FindAllButtonDto) {
    return this.buttonsService.findAll(dto);
  }

  @Get(':id')
  @DecoratorWrapper('Find One Button', true, [Role.Admin])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buttonsService.findOne(id);
  }

  @Patch(':id')
  @DecoratorWrapper('Update Button', true, [Role.Admin])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateButtonDto: UpdateButtonDto,
  ) {
    return this.buttonsService.update(id, updateButtonDto);
  }

  @Delete(':id')
  @DecoratorWrapper('Remove Button', true, [Role.Admin])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.buttonsService.remove(id);
  }
}
