import { Field, InputType, Int } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@InputType()
export class PaymentBody {
  @Field(() => Int, { nullable: false })
  price!: number;
}

@ObjectType()
export class PaymentResponse {
  @Field(() => String, { nullable: false })
  clientSecret!: string;

  @Field(() => String, { nullable: false })
  status!: string;
}

@ObjectType()
export class Payment {}
