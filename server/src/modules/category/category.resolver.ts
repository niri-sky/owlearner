import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from 'src/graphql/@generated/category/category.model';
import { CategoryCreateInput } from 'src/graphql/@generated/category/category-create.input';
import { CategoryUpdateInput } from 'src/graphql/@generated/category/category-update.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CategoryCreateInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCategoryInput') updateCategoryInput: CategoryUpdateInput,
  ) {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Mutation(() => Category)
  removeCategory(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.remove(id);
  }
}
