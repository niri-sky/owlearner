import { Injectable, NotFoundException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { DatabaseService } from 'src/configs/database/database.service';
import { TypedEventEmitter } from 'src/configs/event-emitter/event-emitter.class';
import { TokenService } from 'src/configs/token/token.service';
import { OrganizationCreateInput } from 'src/graphql/@generated/organization/organization-create.input';
import { OrganizationUpdateInput } from 'src/graphql/@generated/organization/organization-update.input';
import { EmailInput } from 'src/graphql/custom/email-input';
import { LoginInput } from 'src/graphql/custom/login-input';
import {
  ChangePasswordInput,
  PasswordInput,
} from 'src/graphql/custom/password-input';
import { SignupInput } from 'src/graphql/custom/signup-input';
import { VerifyInput } from 'src/graphql/custom/verify-input';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: TypedEventEmitter,
    private readonly notificationService: NotificationService,
  ) {}

  async loginOrganization(input: LoginInput) {
    const organization = await this.databaseService.organization.findUnique({
      where: { email: input.email },
      include: {
        organizationEarning: true,
      },
    });

    if (!organization) throw new NotFoundException('Invalid credentials');

    if (!organization.verified) {
      throw new NotFoundException('Account not verified, Please verify');
    }

    if (organization.status != 'active') {
      throw new NotFoundException(
        "Account not approved yet Please wait, You'll receive an email when it's approved",
      );
    }

    const matchPassword = await compare(input.password, organization?.password);

    if (!matchPassword) throw new NotFoundException('Invalid credentials');
    return organization;
  }

  async inviteOrganization(input: OrganizationCreateInput) {
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

    const username = this.tokenService.generateUsername(input?.name);

    const organization = await this.databaseService.organization.create({
      data: { ...(input as any), username },
    });

    const token = await this.tokenService.generate(String(organization.id));

    const link =
      process.env.ORGANIZATION_CLIENT_URL + '/signin/invite/' + token;

    this.eventEmitter.emit('admin.invite', {
      email: organization.email,
      name: organization.name,
      link,
    });

    return organization;
  }

  async acceptInvite(token: string, passwords: PasswordInput) {
    const dataId = await this.tokenService.validate(token);

    const password = await hash(passwords.password, 10);

    const organization = await this.databaseService.organization.update({
      where: { id: Number(dataId) },
      data: {
        status: 'active',
        password,
      },
    });

    await this.tokenService.delete(token);

    return organization;
  }

  async signupOrganization(signupInput: SignupInput) {
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

    const organization = await this.databaseService.organization.create({
      data: { ...signupInput, username },
    });

    const code = String(Math.floor(100000 + Math.random() * 900000));

    const encrypted = this.tokenService.encrypt({
      code,
      email: organization.email,
    });

    const token = await this.tokenService.generate(encrypted);

    this.eventEmitter.emit('email.verify', {
      email: organization.email,
      name: organization.name,
      code,
    });

    return { status: 'success', token };
  }

  async verifyOrganization(verifyInput: VerifyInput) {
    const hash = await this.tokenService.validate(verifyInput.token);

    const data = this.tokenService.decrypt(hash);

    if (verifyInput.email !== data.email || verifyInput.code !== data.code) {
      console.log(verifyInput, data);
      throw new NotFoundException('Invalid code');
    }

    const organization = await this.databaseService.organization.update({
      where: { email: verifyInput.email },
      data: { verified: true },
    });

    this.notificationService.createNotificationForAdmin({
      link: '/organizations',
      text: 'created an organization account.',
      sender: {
        create: {
          type: 'sender',
          userType: 'organization',
          organization: {
            connect: {
              id: Number(organization.id),
            },
          },
        },
      },
    });

    await this.tokenService.delete(verifyInput.token);

    return organization;
  }

  async resetOrganizationPassword(input: EmailInput) {
    const organization = await this.databaseService.organization.findUnique({
      where: { email: input.email },
    });

    if (!organization.verified)
      throw new NotFoundException('Account not verified');

    if (organization.status == 'pending')
      throw new NotFoundException('Account not approved');

    if (!organization) throw new NotFoundException('Organization not found');

    const hash = this.tokenService.encrypt({
      email: organization.email,
      type: 'reset_password',
    });

    const token = await this.tokenService.generate(hash);

    const link =
      process.env.ORGANIZATION_CLIENT_URL + '/signin/password/change/' + token;

    this.eventEmitter.emit('password.request', {
      name: organization.name,
      email: organization.email,
      link,
    });

    return organization;
  }

  async resendVerifyEmail(t: string) {
    const token = await this.tokenService.validateAndGet(t);
    const data = this.tokenService.decrypt(token.data);

    const organization = await this.databaseService.organization.findUnique({
      where: { email: data.email },
    });

    const code = String(Math.floor(100000 + Math.random() * 900000));

    const encrypted = this.tokenService.encrypt({
      code,
      email: organization.email,
    });

    await this.tokenService.update(t, { data: encrypted });

    this.eventEmitter.emit('email.verify', {
      email: organization.email,
      name: organization.name,
      code,
    });

    return { status: 'success', token: token.token };
  }

  async changeOrganizationPassword(t: string, passwords: PasswordInput) {
    const hashData = await this.tokenService.validate(t);
    const data = this.tokenService.decrypt(hashData);
    if (!data || !data.email)
      throw new NotFoundException('Something went wrong');

    const hashPassword = await hash(passwords.password, 10);
    const organization = await this.databaseService.organization.update({
      where: { email: data.email },
      data: { password: hashPassword },
    });

    if (!organization) throw new NotFoundException('Organization not found');

    await this.tokenService.delete(t);

    return organization;
  }

  async create(createOrganizationInput: OrganizationCreateInput) {
    const organization = await this.databaseService.organization.create({
      data: createOrganizationInput as any,
    });
    return organization;
  }

  async findAll() {
    const organizations = await this.databaseService.organization.findMany({
      include: { teachers: { include: { courses: true } } },
    });
    return organizations;
  }

  async findOne(id: number) {
    const organization = await this.databaseService.organization.findUnique({
      where: { id },
      include: {
        links: true,
        followers: {
          include: {
            student: true,
          },
        },
        teachers: {
          include: {
            courses: true,
          },
        },
      },
    });
    return organization;
  }

  async update(id: number, updateOrganizationInput: OrganizationUpdateInput) {
    const organization = await this.databaseService.organization.update({
      where: { id },
      data: Object.assign(
        { ...updateOrganizationInput },
        updateOrganizationInput.links && {
          links: {
            deleteMany: {},
            create: updateOrganizationInput.links.create,
          },
        },
      ) as any,
    });

    if (updateOrganizationInput.status == 'active') {
      const link = process.env.ORGANIZATION_CLIENT_URL + '/signin';
      this.eventEmitter.emit('teacher.approved', {
        email: organization.email,
        name: organization.name,
        link,
      });
    }

    return organization;
  }

  async remove(id: number) {
    const organization = await this.databaseService.organization.delete({
      where: { id },
    });
    return organization;
  }

  async changePassword(id: number, input: ChangePasswordInput) {
    const { confirmPassword, currentPassword, newPassword } = input;
    if (newPassword != confirmPassword) {
      throw new NotFoundException('Password not match');
    }
    const findOrganization = await this.databaseService.organization.findUnique(
      {
        where: { id },
      },
    );
    if (!findOrganization) throw new NotFoundException('Teacher not found');

    const matchPassword = await compare(
      currentPassword,
      findOrganization.password,
    );
    if (!matchPassword) throw new NotFoundException('Invalid current password');

    const password = await hash(newPassword, 10);

    const organization = await this.databaseService.organization.update({
      where: { id },
      data: {
        password,
      },
    });

    return organization;
  }
}
