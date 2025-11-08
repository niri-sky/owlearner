import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatusResponse {
  @Field(() => String, { nullable: false })
  status!: string;
}
