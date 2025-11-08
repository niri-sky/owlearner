import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NotificationFilterInput {
  @Field(() => Int, { nullable: false })
  receiverUserId!: number;
  @Field(() => String, { nullable: false })
  receiverUserType!: string;
}

@InputType()
export class NotificationSenderInput {
  @Field(() => Int, { nullable: false })
  senderUserId!: number;
  @Field(() => String, { nullable: false })
  senderUserType!: string;
}
