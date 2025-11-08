import { Injectable, NotFoundException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { DatabaseService } from 'src/configs/database/database.service';
import { TypedEventEmitter } from 'src/configs/event-emitter/event-emitter.class';
import { TokenService } from 'src/configs/token/token.service';
import { TeacherCreateInput } from 'src/graphql/@generated/teacher/teacher-create.input';
import { TeacherUpdateInput } from 'src/graphql/@generated/teacher/teacher-update.input';
import { TeacherWhereInput } from 'src/graphql/@generated/teacher/teacher-where.input';
import { EmailInput } from 'src/graphql/custom/email-input';
import { InviteInput } from 'src/graphql/custom/invite-response';
import { LoginInput } from 'src/graphql/custom/login-input';
import {
  ChangePasswordInput,
  PasswordInput,
} from 'src/graphql/custom/password-input';
import { SignupInput } from 'src/graphql/custom/signup-input';
import { VerifyInput } from 'src/graphql/custom/verify-input';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TeacherService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly eventEmitter: TypedEventEmitter,
    private readonly tokenService: TokenService,
    private readonly notificationService: NotificationService,
  ) {}

  async loginTeacher(loginInput: LoginInput) {
    const teacher = await this.databaseService.teacher.findUnique({
      where: { email: loginInput.email },
    });

    if (!teacher) throw new NotFoundException('Invalid credentials');

    if (!teacher.verified) {
      throw new NotFoundException('Account not verified, Please verify');
    }

    if (teacher.status != 'active') {
      throw new NotFoundException(
        "Account not approved yet Please wait, You'll receive an email when it's approved",
      );
    }

    const matchPassword = await compare(loginInput.password, teacher?.password);

    if (!matchPassword) throw new NotFoundException('Invalid credentials');

    return teacher;
  }

  async signupTeacher(signupInput: SignupInput, organization: number) {
    const findStudent = await this.databaseService.student.findUnique({
      where: { email: signupInput.email },
    });
    const findTeacher = await this.databaseService.teacher.findUnique({
      where: { email: signupInput.email },
    });
    const findAdmin = await this.databaseService.admin.findUnique({
      where: { email: signupInput.email },
    });
    const findOrganization = await this.databaseService.organization.findUnique(
      { where: { email: signupInput.email } },
    );

    if (findStudent || findTeacher || findAdmin || findOrganization)
      throw new NotFoundException('User already exist');

    signupInput.password = await hash(signupInput.password, 10);

    const username = this.tokenService.generateUsername(signupInput.name);

    const teacher = await this.databaseService.teacher.create({
      data: organization
        ? {
            ...signupInput,
            username,
            organization: { connect: { id: organization } },
          }
        : { ...signupInput, username },
    });

    const code = String(Math.floor(100000 + Math.random() * 900000));

    const encrypted = this.tokenService.encrypt({ code, email: teacher.email });

    const token = await this.tokenService.generate(encrypted);

    this.eventEmitter.emit('email.verify', {
      email: teacher.email,
      name: teacher.name,
      code,
    });

    return { status: 'success', token };
  }

  async resendVerifyEmail(t: string) {
    const token = await this.tokenService.validateAndGet(t);
    const data = this.tokenService.decrypt(token.data);

    const teacher = await this.databaseService.teacher.findUnique({
      where: { email: data.email },
    });

    const code = String(Math.floor(100000 + Math.random() * 900000));

    const encrypted = this.tokenService.encrypt({ code, email: teacher.email });

    await this.tokenService.update(t, { data: encrypted });

    this.eventEmitter.emit('email.verify', {
      email: teacher.email,
      name: teacher.name,
      code,
    });

    return { status: 'success', token: token.token };
  }

  async verifyTeacher(verifyInput: VerifyInput) {
    const hash = await this.tokenService.validate(verifyInput.token);

    const data = this.tokenService.decrypt(hash);

    if (verifyInput.email !== data.email || verifyInput.code !== data.code) {
      console.log(verifyInput, data);
      throw new NotFoundException('Invalid code');
    }

    const teacher = await this.databaseService.teacher.update({
      where: { email: verifyInput.email },
      data: { verified: true },
    });

    await this.tokenService.delete(verifyInput.token);
    if (teacher.organizationId) {
      this.notificationService.create({
        link: '/teachers',
        text: 'created teacher account to your organization',
        sender: {
          create: {
            type: 'sender',
            userType: 'teacher',
            teacher: {
              connect: {
                id: teacher.id,
              },
            },
          },
        },
        receiver: {
          create: {
            type: 'receiver',
            userType: 'organization',
            organization: {
              connect: {
                id: teacher.organizationId,
              },
            },
          },
        },
      });
    } else {
      this.notificationService.createNotificationForAdmin({
        link: '/teachers',
        text: 'created an teacher account without organization.',
        sender: {
          create: {
            type: 'sender',
            userType: 'teacher',
            teacher: {
              connect: {
                id: Number(teacher.id),
              },
            },
          },
        },
      });
    }

    return teacher;
  }

  async resetTeacherPassword(input: EmailInput) {
    const teacher = await this.databaseService.teacher.findUnique({
      where: { email: input.email },
    });

    if (!teacher.verified) throw new NotFoundException('Account not verified');

    if (teacher.status == 'pending')
      throw new NotFoundException('Account not approved');

    if (!teacher) throw new NotFoundException('Teacher not found');

    const hash = this.tokenService.encrypt({
      email: teacher.email,
      type: 'reset_password',
    });

    const token = await this.tokenService.generate(hash);

    const link =
      process.env.TEACHER_CLIENT_URL + '/signin/password/change/' + token;

    this.eventEmitter.emit('password.request', {
      name: teacher.name,
      email: teacher.email,
      link,
    });

    return teacher;
  }

  async changeTeacherPassword(t: string, passwords: PasswordInput) {
    const hashData = await this.tokenService.validate(t);
    const data = this.tokenService.decrypt(hashData);
    if (!data || !data.email)
      throw new NotFoundException('Something went wrong');

    const hashPassword = await hash(passwords.password, 10);
    const teacher = await this.databaseService.teacher.update({
      where: { email: data.email },
      data: { password: hashPassword },
    });

    if (!teacher) throw new NotFoundException('Teacher not found');

    await this.tokenService.delete(t);

    return teacher;
  }

  // organization: { connect: { id: organizationId } }
  async createTeacher(input: TeacherCreateInput) {
    input.password = await hash(input.password, 10);
    const teacher = await this.databaseService.teacher.create({
      data: input as any,
    });
    return teacher;
  }

  async inviteTeacher(input: InviteInput) {
    const findStudent = await this.databaseService.student.findUnique({
      where: { email: input.email },
    });
    const findTeacher = await this.databaseService.teacher.findUnique({
      where: { email: input.email },
    });
    const findAdmin = await this.databaseService.admin.findUnique({
      where: { email: input.email },
    });
    const findOrganization = await this.databaseService.organization.findUnique(
      { where: { email: input.email } },
    );

    if (findStudent || findTeacher || findAdmin || findOrganization)
      throw new NotFoundException('User already exist');

    input.link = `${process.env.TEACHER_CLIENT_URL}/signup?organization=${input.link}&name=${input.name}&email=${input.email}`;
    this.eventEmitter.emit('teacher.invite', input);
    return {
      status: 'Success',
    };
  }

  async findTeachersWithOrg(organizationId: number) {
    const teachers = await this.databaseService.teacher.findMany({
      where: { organizationId },
    });
    return teachers;
  }

  async findAllTeachers(where?: TeacherWhereInput) {
    const teachers = await this.databaseService.teacher.findMany({
      where: where as any,
      include: { organization: true, posts: true, courses: true },
    });
    return teachers;
  }

  async updateTeacher(id: number, updateTeacherInput: TeacherUpdateInput) {
    const teacher = await this.databaseService.teacher.update({
      where: { id },
      data: Object.assign(
        { ...updateTeacherInput },
        updateTeacherInput.links && {
          links: {
            deleteMany: {},
            create: updateTeacherInput.links.create,
          },
        },
      ) as any,
    });

    if (updateTeacherInput.status == 'active') {
      const link = process.env.TEACHER_CLIENT_URL + '/signin';
      this.eventEmitter.emit('teacher.approved', {
        email: teacher.email,
        name: teacher.name,
        link,
      });
    }
    return teacher;
  }

  async removeTeacher(id: number) {
    const teacher = await this.databaseService.teacher.delete({
      where: { id },
    });
    return teacher;
  }

  async findOne(id: number) {
    const teacher = await this.databaseService.teacher.findUnique({
      where: { id },
      include: {
        links: true,
        followers: {
          include: {
            student: true,
          },
        },
        courses: {
          include: {
            teacher: true,
          },
        },
      },
    });
    return teacher;
  }

  async changePassword(id: number, input: ChangePasswordInput) {
    const { confirmPassword, currentPassword, newPassword } = input;
    if (newPassword != confirmPassword) {
      throw new NotFoundException('Password not match');
    }
    const findTeacher = await this.databaseService.teacher.findUnique({
      where: { id },
    });
    if (!findTeacher) throw new NotFoundException('Teacher not found');

    const matchPassword = await compare(currentPassword, findTeacher.password);
    if (!matchPassword) throw new NotFoundException('Invalid current password');

    const password = await hash(newPassword, 10);

    const teacher = await this.databaseService.teacher.update({
      where: { id },
      data: {
        password,
      },
    });

    return teacher;
  }
}
