import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';
import { pubSub } from 'src/configs/pubsub';
import { PubsubService } from 'src/configs/pubsub/pubsub.service';
import { NotificationCreateInput } from 'src/graphql/@generated/notification/notification-create.input';
import { NotificationUpdateInput } from 'src/graphql/@generated/notification/notification-update.input';
import { NotificationWhereInput } from 'src/graphql/@generated/notification/notification-where.input';

@Injectable()
export class NotificationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createNotificationInput: NotificationCreateInput) {
    const notification = await this.databaseService.notification.create({
      data: createNotificationInput as any,
      include: {
        receiver: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
        sender: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
      },
    });

    pubSub.publish('notificationCreated', {
      notificationCreated: notification,
    });
    return notification;
  }

  async createNotificationForAdmin(input: NotificationUpdateInput) {
    const admin = await this.databaseService.admin.findFirst({
      where: {
        role: 'admin',
      },
    });

    const notification = await this.databaseService.notification.create({
      data: {
        ...input,
        receiver: {
          create: {
            type: 'receiver',
            userType: 'admin',
            admin: {
              connect: {
                id: Number(admin.id),
              },
            },
          },
        },
      } as any,
      include: {
        receiver: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
        sender: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
      },
    });

    pubSub.publish('notificationCreated', {
      notificationCreated: notification,
    });
    return notification;
  }

  async findAll(where?: NotificationWhereInput) {
    const notifications = await this.databaseService.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        receiver: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
        sender: {
          include: {
            admin: true,
            organization: true,
            student: true,
            teacher: true,
          },
        },
      },
    });
    return notifications;
  }

  async findOne(id: number) {
    const notification = await this.databaseService.notification.findUnique({
      where: { id },
    });
    return notification;
  }

  async update(id: number, updateNotificationInput: NotificationUpdateInput) {
    const notification = await this.databaseService.notification.update({
      where: { id },
      data: updateNotificationInput as any,
    });
    return notification;
  }

  async remove(id: number) {
    const notification = await this.databaseService.notification.delete({
      where: { id },
    });

    return notification;
  }
}
