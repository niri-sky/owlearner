import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { DatabaseService } from 'src/configs/database/database.service';
import { TokenService } from 'src/configs/token/token.service';

@Module({
  providers: [AdminResolver, AdminService, DatabaseService, TokenService],
})
export class AdminModule {}
