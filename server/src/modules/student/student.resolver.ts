import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { LoginInput } from 'src/graphql/custom/login-input';
import { Student } from 'src/graphql/@generated/student/student.model';
import { StudentCreateInput } from 'src/graphql/@generated/student/student-create.input';
import { StudentUpdateInput } from 'src/graphql/@generated/student/student-update.input';
import { SignupResponse } from 'src/graphql/custom/signup-response';
import { SignupInput } from 'src/graphql/custom/signup-input';
import {
  ChangePasswordInput,
  PasswordInput,
} from 'src/graphql/custom/password-input';
import { EmailInput } from 'src/graphql/custom/email-input';
import { VerifyInput } from 'src/graphql/custom/verify-input';
import { StudentCourse } from 'src/graphql/@generated/student-course/student-course.model';
import { StudentCourseCreateManyInput } from 'src/graphql/@generated/student-course/student-course-create-many.input';
import { StudentWhereInput } from 'src/graphql/@generated/student/student-where.input';
import { Teacher } from 'src/graphql/@generated/teacher/teacher.model';
import { FollowingUser } from 'src/graphql/custom/following-user';
import { FollowingFollower } from 'src/graphql/@generated/following-follower/following-follower.model';
import { FollowingFollowerCreateInput } from 'src/graphql/@generated/following-follower/following-follower-create.input';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Mutation(() => Student)
  loginStudent(@Args('loginInput') loginInput: LoginInput) {
    return this.studentService.loginStudent(loginInput);
  }

  @Mutation(() => SignupResponse)
  signupStudent(@Args('signupInput') signupInput: SignupInput) {
    return this.studentService.signupStudent(signupInput);
  }

  @Mutation(() => Student)
  verifyStudent(@Args('verifyInput') verifyInput: VerifyInput) {
    return this.studentService.verifyStudent(verifyInput);
  }

  @Mutation(() => SignupResponse)
  resendStudentVerify(@Args('token') t: string) {
    return this.studentService.resendVerifyEmail(t);
  }

  @Mutation(() => Student)
  resetStudentPassword(@Args('emailInput') emailInput: EmailInput) {
    return this.studentService.resetStudentPassword(emailInput);
  }
  @Mutation(() => Student)
  changeStudentPassword(
    @Args('token') t: string,
    @Args('passwords') passwords: PasswordInput,
  ) {
    return this.studentService.changeStudentPassword(t, passwords);
  }

  @Mutation(() => Student)
  createStudent(
    @Args('createStudentInput')
    createStudentInput: StudentCreateInput,
  ) {
    return this.studentService.create(createStudentInput);
  }

  @Mutation(() => [StudentCourse])
  addCoursesToStudent(
    @Args('input', { type: () => [StudentCourseCreateManyInput] })
    input: StudentCourseCreateManyInput[],
  ) {
    return this.studentService.addCourse(input);
  }

  @Query(() => [Student], { name: 'students' })
  findAll() {
    return this.studentService.findAll();
  }

  @Query(() => [Student], { name: 'topStudents' })
  findTopStudents(@Args('where', { nullable: true }) where: StudentWhereInput) {
    return this.studentService.findTopStudents(where);
  }

  @Query(() => Student, { name: 'student' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.findOne(id);
  }

  @Query(() => Student, { name: 'studentWithEmail' })
  findOneWithEmail(@Args('email') email: string) {
    return this.studentService.findOneWithEmail(email);
  }

  @Mutation(() => Student)
  updateStudent(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateStudentInput')
    updateStudentInput: StudentUpdateInput,
  ) {
    return this.studentService.update(id, updateStudentInput);
  }

  @Mutation(() => Student)
  removeStudent(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.remove(id);
  }

  @Mutation(() => Student)
  updateTeacherPassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.studentService.changePassword(id, input);
  }

  @Query(() => [FollowingUser])
  followingUsers(@Args('studentId', { type: () => Int }) studentId: number) {
    return this.studentService.getFollowingUsers(studentId);
  }

  @Mutation(() => FollowingFollower)
  followUser(@Args('input') input: FollowingFollowerCreateInput) {
    return this.studentService.followUser(input);
  }

  @Mutation(() => FollowingFollower)
  unfollowUser(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.unfollowUser(id);
  }
}
