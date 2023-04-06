import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { csv2jsonAsync } from 'json-2-csv';
import { User } from '../user/entities/user.entity';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { Blog } from './entities/blog.entity';
import {
  FindOptionsSelect,
  FindOptionsWhere,
  MongoRepository,
  ObjectID,
} from 'typeorm';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: MongoRepository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async create(createBlogInput: CreateBlogInput) {
    try {
      const owner = await this.userRepository.findOne({
        where: { _id: new ObjectId(createBlogInput.owner) },
      });
      if (!owner) {
        return new Error('User is not exist!!!');
      }
      // createBlogInput.owner = new ObjectId(createBlogInput.owner);
      const blog = new Blog({
        ...createBlogInput,
        owner: new ObjectId(createBlogInput.owner),
      } as any);
      return await this.blogRepository.save(blog);
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
    projection?: FindOptionsSelect<Blog>;
    filter?: FindOptionsWhere<Blog>;
  }) {
    try {
      const blogs =
        (!!page &&
          !!perPage &&
          (await this.blogRepository.find({
            where: filter,
            select: projection,
            skip: perPage * (page - 1),
            take: perPage,
          }))) ||
        (await this.blogRepository.find({ where: filter, select: projection }));
      if (blogs.length === 0) {
        return 'Blog not found a';
      }
      return blogs;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(id: any) {
    try {
      const blog = await this.blogRepository
        .aggregate([
          { $match: { _id: id } },
          {
            $lookup: {
              from: 'user',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
        ])
        .next();
      if (!blog) {
        return 'Blog not found';
      }
      return blog;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndUpdate(id: string, updateBlogInput: UpdateBlogInput) {
    try {
      return await this.blogRepository.updateOne({ _id: id }, updateBlogInput, {
        upsert: true,
      });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: ObjectID) {
    try {
      return await this.blogRepository.delete(id);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async addComment({
    blogId,
    comment,
    userId,
  }: {
    blogId: string;
    userId: string;
    comment: string;
  }) {
    try {
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectID(userId) },
      });
      if (!user) {
        return new Error('User is not exist!!!');
      }
      return;
      // return await this.blogRepository.findByIdAndUpdate(
      //   blogId,
      //   {
      //     $push: {
      //       comments: { comment, userId },
      //     },
      //   },
      //   { new: true },
      // );
    } catch (error) {
      return new Error(error.message);
    }
  }

  async initBlogs() {
    try {
      const blogs: Blog[] = await csv2jsonAsync(
        readFileSync('./dataa/blog.csv').toString(),
        { delimiter: { field: '|' } },
      );
      const users = await this.userRepository.find();

      blogs.forEach((blog) => {
        const user =
          users[faker.datatype.number({ min: 0, max: users.length - 1 })];

        blog.owner = user._id;
      });

      return await this.blogRepository.insertMany(blogs);
    } catch (error) {
      return new Error(error.message);
    }
  }
}
