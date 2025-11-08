import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';

import { LoginInput } from 'src/graphql/custom/login-input';
import { compare, hash } from 'bcrypt';
import { TypedEventEmitter } from 'src/configs/event-emitter/event-emitter.class';
import { PasswordInput } from 'src/graphql/custom/password-input';
import { TokenService } from 'src/configs/token/token.service';
import { UpdateAdminProfileInput } from 'src/graphql/custom/update-admin-profile-input';
import { TodoUpdateInput } from 'src/graphql/@generated/todo/todo-update.input';
import { TodoCreateInput } from 'src/graphql/@generated/todo/todo-create.input';
import { AdminCreateInput } from 'src/graphql/@generated/admin/admin-create.input';
import { AdminUpdateInput } from 'src/graphql/@generated/admin/admin-update.input';
import { EmailInput } from 'src/graphql/custom/email-input';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly eventEmitter: TypedEventEmitter,
    private readonly tokenService: TokenService,
  ) {}

  async loginAdmin(loginInput: LoginInput) {
    const admin = await this.databaseService.admin.findUnique({
      where: { email: loginInput.email, status: 'active' },
      include: { todos: true },
    });

    if (!admin) throw new NotFoundException('Invalid credentials');

    const matchPassword = await compare(loginInput.password, admin?.password);

    if (!matchPassword) throw new NotFoundException('Invalid credentials');

    return admin;
  }

  async create(createAdminInput: AdminCreateInput) {
    if (createAdminInput.password) {
      createAdminInput.password = await hash(createAdminInput.password, 10);
    }
    const admin = await this.databaseService.admin.create({
      data: createAdminInput as any,
      include: { todos: true },
    });

    return admin;
  }

  async invite(createAdminInput: AdminCreateInput) {
    const admin = await this.databaseService.admin.create({
      data: createAdminInput as any,
      include: { todos: true },
    });

    const token = await this.tokenService.generate(String(admin.id));

    const link = process.env.ADMIN_CLIENT_URL + '/signin/invite/' + token;

    this.eventEmitter.emit('admin.invite', {
      email: admin.email,
      name: admin.name,
      link,
    });

    return admin;
  }

  async acceptInvite(token: string, passwords: PasswordInput) {
    const dataId = await this.tokenService.validate(token);

    const password = await hash(passwords.password, 10);

    const admin = await this.databaseService.admin.update({
      where: { id: Number(dataId) },
      data: {
        status: 'active',
        password,
      },
    });

    await this.tokenService.delete(token);

    return admin;
  }

  async findAll() {
    const admins = this.databaseService.admin.findMany({
      include: { todos: true },
    });
    return admins;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async resetAdminPassword(input: EmailInput) {
    const admin = await this.databaseService.admin.findUnique({
      where: { email: input.email },
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const hash = this.tokenService.encrypt({
      email: admin.email,
      type: 'reset_password',
    });

    const token = await this.tokenService.generate(hash);

    const link =
      process.env.ADMIN_CLIENT_URL + '/signin/password/change/' + token;

    this.eventEmitter.emit('password.request', {
      name: admin.name,
      email: admin.email,
      link,
    });

    return admin;
  }

  async changeAdminPassword(t: string, passwords: PasswordInput) {
    const hashData = await this.tokenService.validate(t);
    const data = this.tokenService.decrypt(hashData);
    if (!data || !data.email)
      throw new NotFoundException('Something went wrong');

    const hashPassword = await hash(passwords.password, 10);
    const admin = await this.databaseService.admin.update({
      where: { email: data.email },
      data: { password: hashPassword },
    });

    if (!admin) throw new NotFoundException('Organization not found');

    await this.tokenService.delete(t);

    return admin;
  }

  async update(id: number, updateAdminInput: AdminUpdateInput) {
    const admin = await this.databaseService.admin.update({
      where: { id },
      data: updateAdminInput as any,
    });
    return admin;
  }
  async updateAdminProfile(
    id: number,
    updateAdminProfileInput: UpdateAdminProfileInput,
  ) {
    const { name, currentPassword, newPassword, profile } =
      updateAdminProfileInput;
    let password = '';
    if (currentPassword && newPassword) {
      const findAdmin = await this.databaseService.admin.findUnique({
        where: { id },
      });
      if (!findAdmin) throw new NotFoundException('Admin not found');
      const matchPassword = await compare(currentPassword, findAdmin.password);
      if (!matchPassword)
        throw new NotFoundException('Invalid current password');
      password = await hash(newPassword, 10);
    }

    const admin = await this.databaseService.admin.update({
      where: { id },
      data: password ? { name, password, profile } : { name, profile },
      include: { todos: true },
    });

    return admin;
  }

  async remove(id: number) {
    let admin = await this.databaseService.admin.delete({ where: { id } });
    return admin;
  }

  // todos
  async createTodo(createTodoInput: TodoCreateInput) {
    const todo = await this.databaseService.todo.create({
      data: createTodoInput as any,
    });
    return todo;
  }

  async getTodos(adminId: number) {
    const todos = await this.databaseService.todo.findMany({
      where: { adminId },
    });
    return todos;
  }

  async deleteTodo(id: number) {
    const todo = await this.databaseService.todo.delete({ where: { id } });
    return todo;
  }

  async updateTodo(id: number, updateTodoInput: TodoUpdateInput) {
    const todo = await this.databaseService.todo.update({
      data: updateTodoInput as any,
      where: { id },
    });
    return todo;
  }
}
