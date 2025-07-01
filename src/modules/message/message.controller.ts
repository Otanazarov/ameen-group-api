import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindAllMessageDto } from './dto/findAllMessage.dto';
import { FindAllMessageUserDto } from './dto/findAllMessageUser.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @DecoratorWrapper('send Message', true, [Role.Admin])
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  @DecoratorWrapper('Get Messages')
  findAll(@Param() dto: FindAllMessageDto) {
    return this.messageService.findAll(dto);
  }
  @Get('/user')
  @DecoratorWrapper('get Message users')
  findAllUser(@Param() dto: FindAllMessageUserDto) {
    return this.messageService.findAllUser(dto);
  }

  @Get('/user/:id')
  @DecoratorWrapper('get Message user')
  findOneUser(@Param('id', ParseIntPipe) id: string) {
    return this.messageService.findOneUser(+id);
  }

  @Get(':id')
  @DecoratorWrapper('get Message')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('update Message')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.update(+id, updateMessageDto);
  }
}
