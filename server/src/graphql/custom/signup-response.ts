import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupResponse {
  @Field(() => String, { nullable: false })
  status!: string;

  @Field(() => String, { nullable: false })
  token!: string;
}
