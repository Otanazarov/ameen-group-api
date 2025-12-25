import { Body, Controller, Post, Param, Delete, Get } from '@nestjs/common';
import { ViaService } from './via.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { CreateContractRequestDto } from './dto/create-contract-req.dto';
import { RegisterCardDto, VerifyCardDto } from './dto/card-registration.dto';

@ApiTags('Via Payment')
@Controller('via')
export class ViaController {
    constructor(
        private readonly viaService: ViaService,
        private readonly subscriptionService: SubscriptionService,
    ) { }

    @Post('create-contract')
    @DecoratorWrapper('Create Via Subscription Contract')
    @ApiOperation({ summary: 'Create a subscription contract via Via' })
    async createContract(
        @Body() dto: CreateContractRequestDto,
    ) {
        return this.subscriptionService.createViaSubscription(
            dto.userId,
            dto.subscriptionTypeId,
            dto.cardToken,
        );
    }

    @Post('card/register')
    @DecoratorWrapper('Register Via Card')
    @ApiOperation({ summary: 'Register a card via Via' })
    async registerCard(@Body() dto: RegisterCardDto) {
        return this.viaService.registerCard(dto);
    }

    @Post('card/verify')
    @DecoratorWrapper('Verify Via Card')
    @ApiOperation({ summary: 'Verify a card via Via' })
    async verifyCard(@Body() dto: VerifyCardDto) {
        return this.viaService.verifyCard(dto);
    }

    @Delete('deactivate-contract/:id')
    @DecoratorWrapper('Deactivate Via Contract')
    @ApiOperation({ summary: 'Deactivate a subscription contract by ID' })
    async deactivateContract(
        @Param('id') id: string,
    ) {
        return this.subscriptionService.deactivateViaSubscription(id);
    }

    @Delete('delete-contract/:id')
    @DecoratorWrapper('Delete Via Contract')
    @ApiOperation({ summary: 'Delete a subscription contract by ID' })
    async deleteContract(
        @Param('id') id: string,
    ) {
        return this.subscriptionService.deleteViaSubscription(id);
    }

    @Post('card/info')
    @DecoratorWrapper('Get Card Info by Token')
    @ApiOperation({ summary: 'Get card details by token via Via' })
    async getCardInfo(@Body() dto: { token: string }) {
        return this.viaService.getCardInfoByToken(dto);
    }

    @Post('activate-contract/:id')
    @DecoratorWrapper('Activate Via Subscription Contract')
    @ApiOperation({ summary: 'Activate a subscription contract via Via' })
    async activateContract(@Param('id') id: string) {
        return this.viaService.activateContract(id);
    }

    @Get('contract-info/:id')
    @DecoratorWrapper('Get Via Contract Info')
    @ApiOperation({ summary: 'Get a subscription contract info by ID via Via' })
    async getContractInfo(@Param('id') id: string) {
        return this.viaService.getContractInfo(id);
    }
}
