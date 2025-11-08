import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';
import { CategoryCreateInput } from 'src/graphql/@generated/category/category-create.input';
import { CategoryUpdateInput } from 'src/graphql/@generated/category/category-update.input';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CategoryCreateInput) {
    const category = await this.databaseService.category.create({
      data: input as any,
      include: {
        subcategories: {
          include: {
            topics: true,
          },
        },
      },
    });

    return category;
  }

  async findAll() {
    const categories = await this.databaseService.category.findMany({
      include: {
        subcategories: {
          include: { topics: true },
        },
      },
    });
    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, input: CategoryUpdateInput) {
    const category = await this.databaseService.category.update({
      where: { id },
      data: {
        name: input.name,
        subcategories: {
          deleteMany: {},
          ...input.subcategories,
        },
      },
      include: {
        subcategories: {
          include: {
            topics: true,
          },
        },
      },
    });
    return category;
  }

  async remove(id: number) {
    const category = await this.databaseService.category.delete({
      where: { id },
      include: {
        subcategories: {
          include: {
            topics: true,
          },
        },
      },
    });

    return category;
  }
}
