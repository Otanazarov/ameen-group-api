import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllTransactionDto } from './dto/findAll-transaction.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { Role } from 'src/common/auth/roles/role.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query() dto: FindAllTransactionDto) {
    return this.transactionService.findAll(dto);
  }

  @Get('user/:id')
  findOneByUser(
    @Param('id', ParseIntPipe) id: string,
    @Query() dto: PaginationDto,
  ) {
    return this.transactionService.findOneByUserId(+id, dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  @DecoratorWrapper('update transaction', true, [Role.Admin])
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  @DecoratorWrapper('remove transaction', true, [Role.Admin])
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.transactionService.remove(+id);
  }
}
