import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [InvoiceResolver, InvoiceService, DatabaseService],
})
export class InvoiceModule {}
