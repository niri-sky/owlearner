import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';
import { TicketCreateInput } from 'src/graphql/@generated/ticket/ticket-create.input';
import { TicketUpdateInput } from 'src/graphql/@generated/ticket/ticket-update.input';
import { TicketWhereInput } from 'src/graphql/@generated/ticket/ticket-where.input';
import { NotificationService } from '../notification/notification.service';

import rswitch from 'rswitch';

@Injectable()
export class TicketService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(input: TicketCreateInput) {
    const ticket = await this.databaseService.ticket.create({
      data: input as any,
    });

    this.notificationService.createNotificationForAdmin({
      link: '/tickets',
      text: 'created an ticket',
      sender: {
        create: {
          type: 'sender',
          ...rswitch(input.type, {
            teacher: {
              userType: 'teacher',
              teacher: input.teacher,
            },
            student: {
              userType: 'student',
              student: input.student,
            },
            organization: {
              userType: 'organization',
              organization: input.organization,
            },
          }),
        },
      },
    });

    return ticket;
  }

  async findAll(input: TicketWhereInput) {
    const tickets = await this.databaseService.ticket.findMany({
      where: input,
      include: {
        messages: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
        organization: true,
        student: true,
        teacher: true,
      },
    });
    return tickets;
  }

  async findOne(id: number) {
    const ticket = await this.databaseService.ticket.findUnique({
      where: { id },
      include: {
        organization: true,
        student: true,
        teacher: true,
        messages: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
      },
    });
    return ticket;
  }

  async update(id: number, input: TicketUpdateInput) {
    const ticket = await this.databaseService.ticket.update({
      where: { id },
      data: input as any,
    });
    return ticket;
  }

  async remove(id: number) {
    const ticket = await this.databaseService.ticket.delete({ where: { id } });
    return ticket;
  }
}
