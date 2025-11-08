import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleResolver } from './sale.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [SaleResolver, SaleService, DatabaseService],
})
export class SaleModule {}
