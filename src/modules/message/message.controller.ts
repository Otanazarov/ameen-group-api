import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindAllMessageDto } from './dto/findAllMessage.dto';
import { FindAllMessageUserDto } from './dto/findAllMessageUser.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll(dto: FindAllMessageDto) {
    return this.messageService.findAll(dto);
  }
  @Get('/user')
  findAllUser(dto: FindAllMessageUserDto) {
    return this.messageService.findAllUser(dto);
  }

  @Get('/user/:id')
  findOneUser(@Param('id') id: string) {
    return this.messageService.findOneUser(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }
}
