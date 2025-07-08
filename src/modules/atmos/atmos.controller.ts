import { Controller, Post, Body } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';
import { PreApplyAtmosDto } from './dto/preapply.dto';
import { ApplyAtmosDto } from './dto/apply.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';

@Controller('atmos')
export class AtmosController {
  constructor(private readonly atmosService: AtmosService) {}

  @Post()
  @DecoratorWrapper('Create Atmos Link')
  createLink(@Body() dto: CreateAtmosDto) {
    return this.atmosService.createLink(dto);
  }

  @Post('/preapply')
  @DecoratorWrapper('Atmos Pre-apply')
  async preapply(@Body() dto: PreApplyAtmosDto) {
    return this.atmosService.preApplyTransaction(dto);
  }

  @Post('/apply')
  @DecoratorWrapper('Atmos Apply')
  apply(@Body() dto: ApplyAtmosDto) {
    return this.atmosService.applyTransaction(dto);
  }
}
