import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { DatabaseService } from '../database/database.service';

@Module({
  providers: [TokenService, DatabaseService],
  exports: [TokenService],
})
export class TokenModule {}
