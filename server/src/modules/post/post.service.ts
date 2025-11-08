import { Injectable } from '@nestjs/common';

import { PostWhereInput } from 'src/graphql/@generated/post/post-where.input';
import { PostCreateInput } from 'src/graphql/@generated/post/post-create.input';
import { PostUpdateInput } from 'src/graphql/@generated/post/post-update.input';
import { DatabaseService } from 'src/configs/database/database.service';
import { CommentCreateInput } from 'src/graphql/@generated/comment/comment-create.input';
import { CommentUpdateInput } from 'src/graphql/@generated/comment/comment-update.input';
import { PostLikeCreateInput } from 'src/graphql/@generated/post-like/post-like-create.input';
import { PostLikeWhereInput } from 'src/graphql/@generated/post-like/post-like-where.input';
import { PostLikeScalarWhereInput } from 'src/graphql/@generated/post-like/post-like-scalar-where.input';

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPostInput: PostCreateInput) {
    const post = await this.databaseService.post.create({
      data: createPostInput as any,
    });
    return post;
  }

  async findAll(where: PostWhereInput) {
    const posts = await this.databaseService.post.findMany({
      where: where as any,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        likes: true,
        teacher: true,
        organization: true,
        comments: {
          include: {
            replies: {
              include: {
                organization: true,
                teacher: true,
                student: true,
              },
            },
            organization: true,
            teacher: true,
            student: true,
          },
        },
      },
    });
    return posts;
  }

  async findOne(id: number) {
    const post = await this.databaseService.post.findUnique({
      where: { id },
      include: {
        likes: true,
        teacher: true,
        organization: true,
        comments: {
          include: {
            replies: {
              include: {
                organization: true,
                teacher: true,
                student: true,
              },
            },
            organization: true,
            teacher: true,
            student: true,
          },
        },
      },
    });
    return post;
  }

  async update(id: number, updatePostInput: PostUpdateInput) {
    const post = await this.databaseService.post.update({
      where: { id },
      data: updatePostInput as any,
    });
    return post;
  }

  async remove(id: number) {
    const post = await this.databaseService.post.delete({ where: { id } });
    return post;
  }

  async createComment(input: CommentCreateInput) {
    const comment = await this.databaseService.comment.create({
      data: input as any,
    });
    return comment;
  }
  async updateComment(id: number, input: CommentUpdateInput) {
    const comment = await this.databaseService.comment.update({
      where: { id },
      data: input as any,
    });
    return comment;
  }
  async deleteComment(id: number) {
    const comment = await this.databaseService.comment.delete({
      where: { id },
    });
    return comment;
  }

  async createLike(input: PostLikeCreateInput) {
    const postLike = await this.databaseService.postLike.create({
      data: input as any,
    });
    return postLike;
  }

  async deleteLike(where: PostLikeWhereInput) {
    const postLike = await this.databaseService.postLike.deleteMany({
      where: where as any,
    });
    return { status: 'Like deleted' };
  }
}
