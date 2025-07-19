import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { OctobankDto } from './dto/octobank.dto';
import { OctoBankService } from './octobank.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('octobank')
export class OctoBankController {
  constructor(private readonly octobankService: OctoBankService) {}

  @Post('create-checkout-session')
  @HttpCode(200)
  @DecoratorWrapper('OctoBank Create Checkout Session')
  async createCheckoutSession(@Body() dto: CreateSessionDto) {
    return await this.octobankService.createCheckoutSession(dto);
  }

  @Post()
  @HttpCode(200)
  @DecoratorWrapper('OctoBank Webhook')
  async handleWebhook(@Body() dto: OctobankDto) {
    return await this.octobankService.webhook(dto);
  }
}
