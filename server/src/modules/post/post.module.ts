import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [PostResolver, PostService, DatabaseService],
})
export class PostModule {}
