import { Injectable } from '@nestjs/common';
import { AtmosService } from './modules/atmos/atmos.service';

@Injectable()
export class AppService {
  constructor(private readonly atmosService: AtmosService) {}

  onModuleInit() {
    setInterval(async () => {
      const subscriptions = await this.atmosService.getPendingInvoices(); // faqat to‘lanmaganlar
      for (const subscription of subscriptions) {
        await this.atmosService.checkTransactionStatus(
          subscription.transactionId,
        );
      }
    }, 60_000);
  }
}
