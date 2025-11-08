import { Resolver, Query, Args, Int, Float } from '@nestjs/graphql';

import { Payment, PaymentResponse } from 'src/graphql/custom/payment-response';
import { PaymentService } from './payment.service';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Query(() => PaymentResponse)
  createIntends(@Args('price', { type: () => Float }) price: number) {
    return this.paymentService.create(price);
  }
}
