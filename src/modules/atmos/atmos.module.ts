import { Module } from "@nestjs/common";
import { AtmosService } from "./atmos.service";
import { AtmosController } from "./atmos.controller";
import { TransactionModule } from "../trasnaction/transaction.module";
import { TelegramModule } from "../telegram/telegram.module";

@Module({
	controllers: [AtmosController],
	providers: [AtmosService],
	imports: [TransactionModule, TelegramModule],
	exports: [AtmosService],
})
export class AtmosModule {}
