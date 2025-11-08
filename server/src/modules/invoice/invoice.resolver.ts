import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InvoiceService } from './invoice.service';
import { Invoice } from 'src/graphql/@generated/invoice/invoice.model';
import { InvoiceCreateManyInput } from 'src/graphql/@generated/invoice/invoice-create-many.input';
import { InvoiceUpdateInput } from 'src/graphql/@generated/invoice/invoice-update.input';
import { InvoiceCreateInput } from 'src/graphql/@generated/invoice/invoice-create.input';
import { InvoiceWhereInput } from 'src/graphql/@generated/invoice/invoice-where.input';

@Resolver(() => Invoice)
export class InvoiceResolver {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Mutation(() => Invoice)
  createInvoice(@Args('input') createInvoiceInput: InvoiceCreateInput) {
    return this.invoiceService.create(createInvoiceInput);
  }

  @Mutation(() => [Invoice])
  createManyInvoice(
    @Args('input', { type: () => [InvoiceCreateManyInput] })
    input: InvoiceCreateManyInput[],
  ) {
    return this.invoiceService.createMany(input);
  }

  @Query(() => [Invoice], { name: 'invoices' })
  findAll(@Args('where', { nullable: true }) where?: InvoiceWhereInput) {
    return this.invoiceService.findAll();
  }

  @Query(() => Invoice, { name: 'invoice' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Mutation(() => Invoice)
  updateInvoice(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateInvoiceInput: InvoiceUpdateInput,
  ) {
    return this.invoiceService.update(id, updateInvoiceInput);
  }

  @Mutation(() => Invoice)
  removeInvoice(@Args('id', { type: () => Int }) id: number) {
    return this.invoiceService.remove(id);
  }
}
