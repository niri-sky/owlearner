import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [CategoryResolver, CategoryService, DatabaseService],
})
export class CategoryModule {}
