import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCommentInput: CreateCommentInput) {
    try {
      const owner = await this.userRepository.findOneBy({
        id: createCommentInput.ownerId,
      });
      const blog = await this.blogRepository.findOneBy({
        id: createCommentInput.blogId,
      });

      const comment = new Comment({
        content: createCommentInput.content,
        blog,
        owner,
      });
      return await this.commentRepository.save(comment);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async find({
    page,
    perPage,
    projection,
    filter = {},
  }: {
    page?: number;
    perPage?: number;
    projection?: FindOptionsSelect<Comment>;
    filter?: FindOptionsWhere<Comment>;
  }) {
    try {
      const comments =
        (!!page &&
          !!perPage &&
          (await this.commentRepository.find({
            where: filter,
            select: projection,
            skip: perPage * (page - 1),
            take: perPage,
          }))) ||
        (await this.commentRepository.find({
          where: filter,
          select: projection,
        }));
      if (comments.length === 0) {
        return 'commentRepository not found';
      }
      return comments;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(filter: FindOneOptions<Comment> = {}) {
    try {
      const comment = await this.commentRepository.findOne(filter);
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
      await this.commentRepository.update(id, {
        content: updateCommentInput.content,
      });

      return await this.commentRepository.findOneBy({ id });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      const a = await this.userRepository.delete(id);
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
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .where('comment.blogId = :blogId', { blogId })
        .leftJoinAndSelect('comment.owner', 'owner')
        .take(perPage)
        .skip(perPage * (page - 1))
        .getMany();
      // if (comments.length === 0) {
      //   return 'commentRepository not found';
      // }
      return comments;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
