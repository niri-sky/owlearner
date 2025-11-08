import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';
import { InvoiceCreateManyInput } from 'src/graphql/@generated/invoice/invoice-create-many.input';
import { InvoiceCreateInput } from 'src/graphql/@generated/invoice/invoice-create.input';
import { InvoiceUpdateInput } from 'src/graphql/@generated/invoice/invoice-update.input';
import { InvoiceWhereInput } from 'src/graphql/@generated/invoice/invoice-where.input';

@Injectable()
export class InvoiceService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createMany(input: InvoiceCreateManyInput[]) {
    const invoices = await this.databaseService.invoice.create({
      data: input as any,
    });
    return invoices;
  }

  create(createInvoiceInput: InvoiceCreateInput) {
    return 'This action adds a new invoice';
  }

  async findAll(where?: InvoiceWhereInput) {
    const invoices = await this.databaseService.invoice.findMany({
      where: where,
      include: {
        courses: {
          include: {
            teacher: true,
          },
        },
        student: true,
        coupon: true,
      },
    });
    return invoices;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceInput: InvoiceUpdateInput) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
