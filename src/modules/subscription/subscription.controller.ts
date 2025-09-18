import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllSubscriptionDto } from './dto/findAll-subscription.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';

@Controller('subscription')
@ApiTags('Subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('trial/:id')
  @DecoratorWrapper('Activate Free Trial for User', true, [Role.Admin])
  activateFreeTrial(@Param('id', ParseIntPipe) id: string) {
    return this.subscriptionService.activateFreeTrial(+id);
  }

  @Get()
  @DecoratorWrapper('Find Subscriptions', true, [Role.Admin])
  findAll(@Query() dto: FindAllSubscriptionDto) {
    return this.subscriptionService.findAll(dto);
  }

  @Get('user/:id')
  @DecoratorWrapper('Find Subscription by userID')
  findOneByUser(
    @Param('id', ParseIntPipe) id: string,
    @Query() dto: PaginationDto,
  ) {
    return this.subscriptionService.findOneByUserId(+id, dto);
  }

  @Get(':id')
  @DecoratorWrapper('Get Subscription', true, [Role.Admin])
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.subscriptionService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('Update Subscription', true, [Role.Admin])
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  @Delete(':id')
  @DecoratorWrapper('Delete Subscription ', true, [Role.Admin])
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.subscriptionService.remove(+id);
  }
}
