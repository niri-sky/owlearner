import { Field, InputType } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InviteResponse {
  @Field(() => String, { nullable: false })
  status!: string;
}

@InputType()
export class InviteInput {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  email!: string;

  @Field(() => String, { nullable: false })
  link!: string;
}
