import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';

import { LoginInput } from 'src/graphql/custom/login-input';
import { PasswordInput } from 'src/graphql/custom/password-input';
import { UpdateAdminProfileInput } from 'src/graphql/custom/update-admin-profile-input';
import { Admin } from 'src/graphql/@generated/admin/admin.model';
import { Todo } from 'src/graphql/@generated/todo/todo.model';
import { AdminUpdateInput } from 'src/graphql/@generated/admin/admin-update.input';
import { TodoCreateInput } from 'src/graphql/@generated/todo/todo-create.input';
import { TodoUpdateInput } from 'src/graphql/@generated/todo/todo-update.input';
import { AdminCreateInput } from 'src/graphql/@generated/admin/admin-create.input';
import { EmailInput } from 'src/graphql/custom/email-input';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => Admin)
  loginAdmin(@Args('LoginInput') loginInput: LoginInput) {
    return this.adminService.loginAdmin(loginInput);
  }

  @Mutation(() => Admin)
  createAdmin(@Args('CreateAdminInput') createAdminInput: AdminCreateInput) {
    return this.adminService.create(createAdminInput);
  }

  @Mutation(() => Admin)
  inviteAdmin(@Args('CreateAdminInput') createAdminInput: AdminCreateInput) {
    return this.adminService.invite(createAdminInput);
  }

  @Mutation(() => Admin)
  acceptInviteAdmin(
    @Args('Token') token: string,
    @Args('Passwords') passwords: PasswordInput,
  ) {
    return this.adminService.acceptInvite(token, passwords);
  }

  @Mutation(() => Admin)
  resetAdminPassword(@Args('emailInput') emailInput: EmailInput) {
    return this.adminService.resetAdminPassword(emailInput);
  }

  @Mutation(() => Admin)
  changeAdminPassword(
    @Args('token') t: string,
    @Args('passwords') passwords: PasswordInput,
  ) {
    return this.adminService.changeAdminPassword(t, passwords);
  }

  @Query(() => [Admin], { name: 'admins' })
  findAllAdmin() {
    return this.adminService.findAll();
  }

  @Query(() => Admin, { name: 'admin' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.findOne(id);
  }

  @Query(() => [Todo], { name: 'todos' })
  findTodos(@Args('AdminId', { type: () => Int }) adminId: number) {
    return this.adminService.getTodos(adminId);
  }

  @Mutation(() => Admin)
  updateAdmin(
    @Args('id', { type: () => Int }) id: number,
    @Args('UpdateAdminInput') updateAdminInput: AdminUpdateInput,
  ) {
    return this.adminService.update(id, updateAdminInput);
  }

  @Mutation(() => Todo)
  createTodo(@Args('CreateTodoInput') createTodoInput: TodoCreateInput) {
    return this.adminService.createTodo(createTodoInput);
  }

  @Mutation(() => Todo)
  updateTodo(
    @Args('id', { type: () => Int }) id: number,
    @Args('UpdateTodoInput') updateTodoInput: TodoUpdateInput,
  ) {
    return this.adminService.updateTodo(id, updateTodoInput);
  }

  @Mutation(() => Todo)
  deleteTodo(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.deleteTodo(id);
  }

  @Mutation(() => Admin)
  updateAdminProfile(
    @Args('id', { type: () => Int }) id: number,
    @Args('AdminProfileInput') updateAdminProfileInput: UpdateAdminProfileInput,
  ) {
    return this.adminService.updateAdminProfile(id, updateAdminProfileInput);
  }

  @Mutation(() => Admin)
  removeAdmin(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.remove(id);
  }
}
