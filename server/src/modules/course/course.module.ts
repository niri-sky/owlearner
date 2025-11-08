import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { DatabaseService } from 'src/configs/database/database.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  providers: [
    CourseResolver,
    CourseService,
    DatabaseService,
    NotificationService,
  ],
})
export class CourseModule {}
