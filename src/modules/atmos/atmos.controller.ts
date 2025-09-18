import { Controller, Post, Body } from '@nestjs/common';
import { AtmosService } from './atmos.service';
import { CreateAtmosDto } from './dto/create.dto';
import { PreApplyAtmosDto } from './dto/preapply.dto';
import { ApplyAtmosDto } from './dto/apply.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { User } from '@prisma/client';
import { BindCardInitDto } from './dto/bind-card-init.dto';
import { BindCardConfirmDto } from './dto/bind-card-confirm.dto';
import { GetUser } from 'src/common/auth/get-user.decorator';
import { ConfirmSchedulerDto } from './dto/confirm-scheduler.dto';

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

  @Post('bind-card/init')
  @DecoratorWrapper('Bind card init')
  bindCardInit(@Body() dto: BindCardInitDto ) {
    return this.atmosService.bindCardInit(dto);
  }

  @Post('bind-card/confirm')
  @DecoratorWrapper('Bind card confirm')
  bindCardConfirm(@Body() dto: BindCardConfirmDto) {
    return this.atmosService.bindCardConfirm(dto);
  }

  @Post('scheduler/confirm')
  @DecoratorWrapper('Confirm scheduler')
  confirmScheduler(@Body() dto: ConfirmSchedulerDto) {
    return this.atmosService.confirmScheduler(dto);
  }
}
