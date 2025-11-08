import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SaleService } from './sale.service';
import { CourseSale } from 'src/graphql/@generated/course-sale/course-sale.model';
import { CourseSaleCreateInput } from 'src/graphql/@generated/course-sale/course-sale-create.input';
import { CourseSaleUpdateInput } from 'src/graphql/@generated/course-sale/course-sale-update.input';
import { CourseSaleCreateManyInput } from 'src/graphql/@generated/course-sale/course-sale-create-many.input';
import { StatusResponse } from 'src/graphql/custom/status-response';
import { TeacherEarning } from 'src/graphql/@generated/teacher-earning/teacher-earning.model';
import { OrganizationEarning } from 'src/graphql/@generated/organization-earning/organization-earning.model';
import { WithdrawRequestInput } from 'src/graphql/custom/withdraw-input';
import { PaymentInvoice } from 'src/graphql/@generated/payment-invoice/payment-invoice.model';
import { PaymentInvoiceWhereInput } from 'src/graphql/@generated/payment-invoice/payment-invoice-where.input';
import { PaymentInvoiceUpdateInput } from 'src/graphql/@generated/payment-invoice/payment-invoice-update.input';

@Resolver(() => CourseSale)
export class SaleResolver {
  constructor(private readonly saleService: SaleService) {}

  @Mutation(() => CourseSale)
  createSale(@Args('input') input: CourseSaleCreateInput) {
    return this.saleService.create(input);
  }

  @Mutation(() => StatusResponse)
  createSales(
    @Args('input', { type: () => [CourseSaleCreateManyInput] })
    input: CourseSaleCreateManyInput[],
  ) {
    return this.saleService.createMany(input);
  }

  @Query(() => [CourseSale], { name: 'sales' })
  findAll() {
    return this.saleService.findAll();
  }

  @Query(() => CourseSale, { name: 'sale' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.saleService.findOne(id);
  }

  @Mutation(() => CourseSale)
  updateSale(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: CourseSaleUpdateInput,
  ) {
    return this.saleService.update(id, input);
  }

  @Mutation(() => CourseSale)
  removeSale(@Args('id', { type: () => Int }) id: number) {
    return this.saleService.remove(id);
  }

  @Query(() => TeacherEarning)
  teacherEarning(@Args('teacherId', { type: () => Int }) id: number) {
    return this.saleService.findTeacherEarning(id);
  }

  @Query(() => OrganizationEarning)
  organizationEarning(@Args('organizationId', { type: () => Int }) id: number) {
    return this.saleService.findOrganizationEarning(id);
  }

  @Query(() => [PaymentInvoice])
  paymentInvoices(
    @Args('where', { nullable: true }) where: PaymentInvoiceWhereInput,
  ) {
    return this.saleService.findPaymentInvoices(where);
  }

  @Mutation(() => PaymentInvoice)
  updatePaymentInvoice(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: PaymentInvoiceUpdateInput,
  ) {
    return this.saleService.updatePaymentInvoices(id, input);
  }

  @Mutation(() => StatusResponse)
  requestTeacherWithdraw(
    @Args('input', { type: () => WithdrawRequestInput })
    input: WithdrawRequestInput,
  ) {
    return this.saleService.requestTeacherWithdraw(input);
  }

  @Mutation(() => StatusResponse)
  requestOrganizationWithdraw(
    @Args('input', { type: () => WithdrawRequestInput })
    input: WithdrawRequestInput,
  ) {
    return this.saleService.requestOrganizationWithdraw(input);
  }
}
