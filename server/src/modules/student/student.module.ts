import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentResolver } from './student.resolver';
import { DatabaseService } from 'src/configs/database/database.service';
import { TokenService } from 'src/configs/token/token.service';

@Module({
  providers: [StudentResolver, StudentService, DatabaseService, TokenService],
})
export class StudentModule {}
