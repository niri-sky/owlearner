import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from 'src/configs/event-emitter/event-emitter.class';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('admin.invite')
  async adminInvite(data: EventPayloads['admin.invite']) {
    const { link, name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Invitation',
      template: 'invite_admin',
      context: {
        name,
        link,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }
  @OnEvent('teacher.invite')
  async teacherInvite(data: EventPayloads['teacher.invite']) {
    const { link, email, name } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Invitation',
      template: 'invite_teacher',
      context: {
        name,
        link,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }

  @OnEvent('organization.invite')
  async organizationInvite(data: EventPayloads['organization.invite']) {
    const { link, name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Invitation',
      template: 'invite_organization',
      context: {
        name,
        link,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }

  @OnEvent('teacher.approved')
  async approvedTeacher(data: EventPayloads['teacher.approved']) {
    const { link, name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your account has been approved',
      template: 'approved_teacher',
      context: {
        name,
        link,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }

  @OnEvent('organization.approved')
  async approvedOrganization(data: EventPayloads['organization.approved']) {
    const { link, name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your account has been approved',
      template: 'approved_organization',
      context: {
        name,
        link,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }

  @OnEvent('student.banned')
  async studentBanned(data: EventPayloads['student.banned']) {
    const { name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your account has been approved',
      template: 'student_banned',
      context: {
        name,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }

  @OnEvent('student.unbanned')
  async studentUnbanned(data: EventPayloads['student.unbanned']) {
    const { link, name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your account has been approved',
      template: 'student_unbanned',
      context: {
        name,
        link,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }

  @OnEvent('email.verify')
  async emailVerify(data: EventPayloads['email.verify']) {
    const { code, name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: 'verify_email',
      context: {
        name,
        code,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }

  @OnEvent('password.request')
  async requestResetPassword(data: EventPayloads['password.request']) {
    const { link, name, email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'reset_password',
      context: {
        name,
        link,
        APP_NAME: process.env.APP_NAME,
      },
    });
  }
}
