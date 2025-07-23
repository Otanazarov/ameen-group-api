import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/')
  @DecoratorWrapper('get stats')
  async getStats() {
    return this.statisticsService.getStats();
  }

  @Get('user/subscriptionType')
  @DecoratorWrapper('get user count by subscription type')
  async getUserCountBySubscriptionType() {
    return this.statisticsService.getUserCountBySubscriptionType();
  }
}
