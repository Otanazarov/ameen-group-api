import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SubscriptionTypeService } from './subscription-type.service';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
import { FindAllSubscriptionTypeDto } from './dto/findAll-subscriptionType.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('subscription-type')
@ApiTags('Subscription Type')
export class SubscriptionTypeController {
  constructor(
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  @Post()
  @DecoratorWrapper('Create Subscription Type', true, [Role.Admin])
  create(@Body() createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    return this.subscriptionTypeService.create(createSubscriptionTypeDto);
  }

  @Get()
  @DecoratorWrapper('Find All Subscription Types')
  findAll(@Query() dto: FindAllSubscriptionTypeDto) {
    return this.subscriptionTypeService.findAll(dto);
  }

  @Get(':id')
  @DecoratorWrapper('Find One Subscription Type')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.subscriptionTypeService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('Update Subscription Type', true, [Role.Admin])
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateSubscriptionTypeDto: UpdateSubscriptionTypeDto,
  ) {
    return this.subscriptionTypeService.update(+id, updateSubscriptionTypeDto);
  }

  @Delete(':id')
  @DecoratorWrapper('Remove Subscription Type', true, [Role.Admin])
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.subscriptionTypeService.remove(+id);
  }
}
