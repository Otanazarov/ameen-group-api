import { Module } from "@nestjs/common";
import { AtmosService } from "./atmos.service";
import { AtmosController } from "./atmos.controller";
import { TransactionModule } from "../trasnaction/transaction.module";

@Module({
	controllers: [AtmosController],
	providers: [AtmosService],
	imports: [TransactionModule],
	exports: [AtmosService],
})
export class AtmosModule {}
