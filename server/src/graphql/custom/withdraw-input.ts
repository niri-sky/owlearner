import { Field, Int } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class WithdrawRequestInput {
  @Field(() => Int, { nullable: false })
  amount!: number;

  @Field(() => String, { nullable: false })
  bankDetails!: string;

  @Field(() => Int, { nullable: false })
  id!: number;
}
