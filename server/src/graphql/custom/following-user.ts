import { Field, ObjectType } from '@nestjs/graphql';
import { Teacher } from '../@generated/teacher/teacher.model';

@ObjectType()
export class FollowingUser extends Teacher {
  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => String, { nullable: true })
  userId: string;
  //
}
