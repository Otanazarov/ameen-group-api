import { Injectable } from "@nestjs/common";
import { AtmosService } from "./modules/atmos/atmos.service";

// app.service.ts
@Injectable()
export class AppService {
  constructor(private readonly atmosService: AtmosService) {}

  onModuleInit() {
    setInterval(async () => {
      const subscriptions = await this.atmosService.getPendingInvoices(); // faqat to‘lanmaganlar
      for (const subscription of subscriptions) {
        await this.atmosService.checkTransactionStatus(subscription.transactionId); // corrected variable name
      }
    }, 60_000); // har 60 soniyada tekshiriladi
  }
}
