import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { CreateAtmoDto } from './dto/create.dto';
import { AtmosDto } from './dto/atmos.dto';

@Controller('atmos')
export class AtmosController {
  constructor(private readonly atmosService: AtmosService) {}

  @Post()
  createLink(@Body() dto: CreateAtmoDto) {
    return this.atmosService.createLink(dto);
  }
}
