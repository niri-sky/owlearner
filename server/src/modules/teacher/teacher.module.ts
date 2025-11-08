import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherResolver } from './teacher.resolver';
import { DatabaseService } from 'src/configs/database/database.service';
import { TokenService } from 'src/configs/token/token.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  providers: [
    TeacherResolver,
    TeacherService,
    DatabaseService,
    TokenService,
    NotificationService,
  ],
})
export class TeacherModule {}
