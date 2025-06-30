import { Controller, Post, Body } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';
import { PreApplyAtmosDto } from './dto/preapply.dto';
import { ApplyAtmosDto } from './dto/apply.dto';

@Controller('atmos')
export class AtmosController {
  constructor(private readonly atmosService: AtmosService) {}

  @Post()
  createLink(@Body() dto: CreateAtmosDto) {
    return this.atmosService.createLink(dto);
  }

  @Post('/preapply')
  async preapply(@Body() dto: PreApplyAtmosDto) {
    return this.atmosService.preApplyTransaction(dto);
  }

  @Post('/apply')
  apply(@Body() dto: ApplyAtmosDto) {
    return this.atmosService.applyTransaction(dto);
  }
}
