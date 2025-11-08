import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeacherService } from './teacher.service';
import { LoginInput } from 'src/graphql/custom/login-input';
import { Teacher } from 'src/graphql/@generated/teacher/teacher.model';
import { TeacherCreateInput } from 'src/graphql/@generated/teacher/teacher-create.input';
import { TeacherUpdateInput } from 'src/graphql/@generated/teacher/teacher-update.input';
import { SignupResponse } from 'src/graphql/custom/signup-response';
import { SignupInput } from 'src/graphql/custom/signup-input';
import { VerifyInput } from 'src/graphql/custom/verify-input';
import { EmailInput } from 'src/graphql/custom/email-input';
import {
  ChangePasswordInput,
  PasswordInput,
} from 'src/graphql/custom/password-input';
import { TeacherWhereInput } from 'src/graphql/@generated/teacher/teacher-where.input';
import {
  InviteInput,
  InviteResponse,
} from 'src/graphql/custom/invite-response';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Mutation(() => Teacher)
  loginTeacher(@Args('loginInput') loginInput: LoginInput) {
    return this.teacherService.loginTeacher(loginInput);
  }

  @Mutation(() => SignupResponse)
  signupTeacher(
    @Args('signupInput') signupInput: SignupInput,
    @Args('organization', { type: () => Int, nullable: true })
    organization: number,
  ) {
    return this.teacherService.signupTeacher(signupInput, organization);
  }

  @Mutation(() => Teacher)
  verifyTeacher(@Args('verifyInput') verifyInput: VerifyInput) {
    return this.teacherService.verifyTeacher(verifyInput);
  }

  @Mutation(() => SignupResponse)
  resendTeacherVerify(@Args('token') token: string) {
    return this.teacherService.resendVerifyEmail(token);
  }

  @Mutation(() => Teacher)
  resetTeacherPassword(@Args('emailInput') emailInput: EmailInput) {
    return this.teacherService.resetTeacherPassword(emailInput);
  }
  @Mutation(() => Teacher)
  changeTeacherPassword(
    @Args('token') t: string,
    @Args('passwords') passwords: PasswordInput,
  ) {
    return this.teacherService.changeTeacherPassword(t, passwords);
  }

  @Mutation(() => Teacher)
  createTeacher(
    @Args('createTeacherInput')
    createTeacherInput: TeacherCreateInput,
  ) {
    return this.teacherService.createTeacher(createTeacherInput);
  }

  @Mutation(() => InviteResponse)
  inviteTeacher(@Args('inviteInput') input: InviteInput) {
    return this.teacherService.inviteTeacher(input);
  }

  @Query(() => [Teacher], { name: 'teachersWithOrg' })
  findTeachersWithOrg(
    @Args('organizationId', { type: () => Int }) organizationId: number,
  ) {
    return this.teacherService.findTeachersWithOrg(organizationId);
  }

  @Query(() => [Teacher], { name: 'teachers' })
  findAllTeachers(
    @Args('where', { nullable: true }) where?: TeacherWhereInput,
  ) {
    return this.teacherService.findAllTeachers(where);
  }

  @Query(() => Teacher, { name: 'teacher' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.teacherService.findOne(id);
  }

  @Mutation(() => Teacher)
  updateTeacher(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTeacherInput')
    updateTeacherInput: TeacherUpdateInput,
  ) {
    return this.teacherService.updateTeacher(id, updateTeacherInput);
  }

  @Mutation(() => Teacher)
  removeTeacher(@Args('id', { type: () => Int }) id: number) {
    return this.teacherService.removeTeacher(id);
  }

  @Mutation(() => Teacher)
  updateTeacherPassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.teacherService.changePassword(id, input);
  }
}
