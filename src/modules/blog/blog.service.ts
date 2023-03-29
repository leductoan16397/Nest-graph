import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { readFileSync } from 'fs';
import { csv2jsonAsync } from 'json-2-csv';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createBlogInput: CreateBlogInput) {
    try {
      const owner = await this.userModel.findById(createBlogInput.owner);
      if (!owner) {
        return new Error('User is not exist!!!');
      }
      const blog = new this.blogModel(createBlogInput);
      return await blog.save();
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
    projection?: ProjectionType<Blog>;
    filter?: FilterQuery<Blog>;
  }) {
    try {
      const blogs =
        (!!page &&
          !!perPage &&
          (await this.blogModel
            .find(filter, projection)
            .limit(perPage)
            .skip(perPage * (page - 1)))) ||
        (await this.blogModel.find(filter, projection).populate('owner'));
      if (blogs.length === 0) {
        return 'Blog not found a';
      }
      return blogs;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(filter: FilterQuery<Blog> = {}) {
    try {
      const blog = await this.blogModel.findOne(filter).exec();
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
      return await this.blogModel.findByIdAndUpdate(id, updateBlogInput, {
        new: true,
        upsert: true,
      });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.blogModel.findByIdAndDelete(id);
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
      const user = await this.userModel.findById(userId);
      if (!user) {
        return new Error('User is not exist!!!');
      }

      return await this.blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: {
            comments: { comment, userId },
          },
        },
        { new: true },
      );
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
      const users = await this.userModel.find();

      blogs.forEach((blog) => {
        const user =
          users[faker.datatype.number({ min: 0, max: users.length - 1 })];

        blog.owner = user._id;
      });

      return await this.blogModel.insertMany(blogs);
    } catch (error) {
      return new Error(error.message);
    }
  }
}
