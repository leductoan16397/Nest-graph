import { faker } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { csv2jsonAsync } from 'json-2-csv';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { PrismaService } from '../common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async create(createBlogInput: CreateBlogInput) {
    try {
      const owner = await this.prismaService.user.findUnique({
        where: { id: createBlogInput.ownerId },
      });
      if (!owner) {
        return new Error('User is not exist!!!');
      }
      return await this.prismaService.blog.create({
        data: {
          content: createBlogInput.content,
          description: createBlogInput.description,
          title: createBlogInput.title,
          ownerId: owner.id,
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
    projection?: Prisma.BlogSelect;
    filter?: Prisma.BlogWhereInput;
  }) {
    try {
      const blogs = await this.prismaService.blog.findMany({
        where: filter,
        select: projection,
        skip: perPage * (page - 1),
        take: perPage,
      });
      if (blogs.length === 0) {
        console.log('Blog not found a');
      }
      return blogs;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const blog = await this.prismaService.blog.findUnique({ where: { id } });
      if (!blog) {
        return 'Blog not found';
      }
      return blog;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByIdAndUpdate(id: number, updateBlogInput: UpdateBlogInput) {
    try {
      return await this.prismaService.blog.update({
        where: { id },
        data: updateBlogInput,
      });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      return await this.prismaService.blog.delete({ where: { id } });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async initBlogs() {
    try {
      const blogsdata = await csv2jsonAsync(
        readFileSync('./dataa/blog.csv').toString(),
        { delimiter: { field: '|' } },
      );
      const users = await this.prismaService.user.findMany();
      const blogs: Prisma.BlogCreateManyInput[] = [];
      blogsdata.forEach((blogdata) => {
        const user =
          users[faker.datatype.number({ min: 0, max: users.length - 1 })];

        const blog: Prisma.BlogCreateManyInput = {
          content: blogdata.content,
          description: blogdata.description,
          title: blogdata.title,
          ownerId: user.id,
        };
        blogs.push(blog);
      });

      return await this.prismaService.blog.createMany({ data: blogs });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async blogsByUserId(userId: number) {
    try {
      const blogs = await this.prismaService.blog.findMany({
        where: { ownerId: userId },
      });
      return blogs;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
