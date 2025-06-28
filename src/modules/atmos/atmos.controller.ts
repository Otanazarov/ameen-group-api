import { Controller, Post, Body } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';

@Controller('atmos')
export class AtmosController {
  constructor(private readonly atmosService: AtmosService) {}

  @Post()
  createLink(@Body() dto: CreateAtmosDto) {
    return this.atmosService.createLink(dto);
  }

  @Post('/preapply')
  async preapply(@Body() dto: any) {
    return this.atmosService.preApplyTransaction(dto);
  }

  @Post('/apply')
  apply(@Body() dto: any) {
    return this.atmosService.applyTransaction(dto);
  }
}
