import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAdminProfileInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  currentPassword?: string;

  @Field(() => String, { nullable: true })
  newPassword?: string;

  @Field(() => String, { nullable: true })
  profile?: string;
}
