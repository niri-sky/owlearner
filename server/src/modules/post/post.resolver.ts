import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from 'src/graphql/@generated/post/post.model';
import { PostCreateInput } from 'src/graphql/@generated/post/post-create.input';
import { PostWhereInput } from 'src/graphql/@generated/post/post-where.input';
import { PostUpdateInput } from 'src/graphql/@generated/post/post-update.input';
import { Comment } from 'src/graphql/@generated/comment/comment.model';
import { CommentCreateInput } from 'src/graphql/@generated/comment/comment-create.input';
import { CommentUpdateInput } from 'src/graphql/@generated/comment/comment-update.input';
import { PostLike } from 'src/graphql/@generated/post-like/post-like.model';
import { PostLikeCreateInput } from 'src/graphql/@generated/post-like/post-like-create.input';
import { PostLikeWhereInput } from 'src/graphql/@generated/post-like/post-like-where.input';
import { StatusResponse } from 'src/graphql/custom/status-response';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: PostCreateInput) {
    return this.postService.create(createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll(@Args('where', { nullable: true }) where: PostWhereInput) {
    return this.postService.findAll(where);
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePostInput') updatePostInput: PostUpdateInput,
  ) {
    return this.postService.update(id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.remove(id);
  }

  @Mutation(() => Comment)
  createComment(@Args('input') input: CommentCreateInput) {
    return this.postService.createComment(input);
  }
  @Mutation(() => Comment)
  updateComment(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: CommentUpdateInput,
  ) {
    return this.postService.updateComment(id, input);
  }

  @Mutation(() => Comment)
  deleteComment(@Args('id', { type: () => Int }) id: number) {
    return this.postService.deleteComment(id);
  }

  @Mutation(() => PostLike)
  createLike(@Args('input') input: PostLikeCreateInput) {
    return this.postService.createLike(input);
  }

  @Mutation(() => StatusResponse)
  deleteLike(@Args('where') where: PostLikeWhereInput) {
    return this.postService.deleteLike(where);
  }
}
