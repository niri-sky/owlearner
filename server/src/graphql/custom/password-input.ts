import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class PasswordInput {
  @Field(() => String, { nullable: false })
  password!: string;

  @Field(() => String, { nullable: false })
  confirmPassword!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => String, { nullable: false })
  currentPassword!: string;

  @Field(() => String, { nullable: false })
  newPassword!: string;

  @Field(() => String, { nullable: false })
  confirmPassword!: string;
}
