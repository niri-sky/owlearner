import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { NotificationCreateInput } from 'src/graphql/@generated/notification/notification-create.input';
import { NotificationUpdateInput } from 'src/graphql/@generated/notification/notification-update.input';
import { NotificationWhereInput } from 'src/graphql/@generated/notification/notification-where.input';
import { Notification } from 'src/graphql/@generated/notification/notification.model';
import { NotificationFilterInput } from 'src/graphql/custom/notification-filter-input';
import { pubSub } from 'src/configs/pubsub';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Subscription(() => Notification, {
    filter(payload, variables, context) {
      const receiver = payload?.notificationCreated?.receiver;

      const where = variables?.where;

      if (where?.receiverUserType == 'admin') {
        return true;
      }

      return (
        receiver?.userType == where?.receiverUserType &&
        receiver?.[where?.receiverUserType]?.id == where?.receiverUserId
      );
    },
  })
  notificationCreated(
    @Args('where', { nullable: true }) where?: NotificationFilterInput,
  ) {
    return pubSub.asyncIterator('notificationCreated');
  }

  @Mutation(() => Notification)
  async createNotification(
    @Args('createNotificationInput')
    createNotificationInput: NotificationCreateInput,
  ) {
    const notification = await this.notificationService.create(
      createNotificationInput,
    );
    return notification;
  }

  @Mutation(() => Notification)
  async createNotificationForAdmin(
    @Args('input')
    input: NotificationUpdateInput,
  ) {
    const notification =
      await this.notificationService.createNotificationForAdmin(input);

    return notification;
  }

  @Query(() => [Notification], { name: 'notifications' })
  findAll(@Args('where', { nullable: true }) where?: NotificationWhereInput) {
    return this.notificationService.findAll(where);
  }

  @Query(() => Notification, { name: 'notification' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.findOne(id);
  }

  @Mutation(() => Notification)
  updateNotification(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateNotificationInput')
    updateNotificationInput: NotificationUpdateInput,
  ) {
    return this.notificationService.update(id, updateNotificationInput);
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.remove(id);
  }
}
