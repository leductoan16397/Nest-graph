import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentInput: CreateCommentInput) {
    try {
      const owner = await this.prismaService.user.findUnique({
        where: {
          id: createCommentInput.ownerId,
        },
      });
      const blog = await this.prismaService.blog.findUnique({
        where: { id: createCommentInput.blogId },
      });

      return await this.prismaService.comment.create({
        data: {
          content: createCommentInput.content,
          ownerId: owner.id,
          blogId: blog.id,
        },
      });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async find({
    page = 1,
    perPage = 10,
    projection,
    filter = {},
  }: {
    page?: number;
    perPage?: number;
    projection?: Prisma.CommentSelect;
    filter?: Prisma.CommentWhereInput;
  }) {
    try {
      const comments = await this.prismaService.comment.findMany({
        where: filter,
        select: projection,
        skip: perPage * (page - 1),
        take: perPage,
      });
      if (comments.length === 0) {
        console.log('prismaService.comment not found');
      }
      return comments;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(filter: Prisma.CommentWhereInput = {}) {
    try {
      const comment = await this.prismaService.comment.findFirst({
        where: filter,
      });
      if (!comment) {
        return 'comment not found';
      }
      return comment;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndUpdate(
    id: number,
    updateCommentInput: Pick<UpdateCommentInput, 'content'>,
  ) {
    try {
      await this.prismaService.comment.update({
        where: { id },
        data: {
          content: updateCommentInput.content,
        },
      });

      return await this.prismaService.comment.findUnique({ where: { id } });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      const a = await this.prismaService.user.delete({ where: { id } });
      return a;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async commentsByBlogId({
    blogId,
    page = 1,
    perPage = 10,
  }: {
    blogId: number;
    page?: number;
    perPage?: number;
  }) {
    try {
      const comments = await this.prismaService.comment.findMany({
        where: { blogId },
        take: perPage,
        skip: perPage * (page - 1),
      });
      return comments;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
