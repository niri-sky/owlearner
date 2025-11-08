import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [NotificationResolver, NotificationService, DatabaseService],
})
export class NotificationModule {}
