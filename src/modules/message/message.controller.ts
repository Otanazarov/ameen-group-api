import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindAllMessageDto } from './dto/findAllMessage.dto';
import { FindAllMessageUserDto } from './dto/findAllMessageUser.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from 'src/common/utils/file-upload.utils';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @DecoratorWrapper('send Message', true, [Role.Admin])
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      fileUploadOptions,
    ),
  )
  create(
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    return this.messageService.create(createMessageDto, files);
  }

  @Get()
  @DecoratorWrapper('Get Messages')
  findAll(@Query() dto: FindAllMessageDto) {
    return this.messageService.findAll(dto);
  }

  @Get('/message')
  @DecoratorWrapper('get Message users')
  findAllUser(@Query() dto: FindAllMessageUserDto) {
    return this.messageService.findAllUser(dto);
  }

  @Get('user/:id')
  @DecoratorWrapper('get user messages')
  findOneByUser(
    @Param('id', ParseIntPipe) id: string,
    @Query() dto: PaginationDto,
  ) {
    return this.messageService.findOneByUserId(+id, dto);
  }

  @Get('/message/:id')
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
