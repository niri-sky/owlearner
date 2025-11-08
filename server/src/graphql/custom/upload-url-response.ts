import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadUrlResponse {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  assets_id!: string;

  @Field(() => String, { nullable: false })
  url!: string;
}
