import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { csv2jsonAsync } from 'json-2-csv';
import { User } from '../user/entities/user.entity';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { Blog } from './entities/blog.entity';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBlogInput: CreateBlogInput) {
    try {
      const owner = await this.userRepository.findOne({
        where: { id: createBlogInput.owner },
      });
      if (!owner) {
        return new Error('User is not exist!!!');
      }
      const blog = new Blog({
        content: createBlogInput.content,
        description: createBlogInput.description,
        title: createBlogInput.title,
        owner,
      });
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

      // const blogs = await this.blogRepository
      //   .createQueryBuilder('blog')
      //   .leftJoinAndSelect('blog.owner', 'owner')
      //   .getMany();
      if (blogs.length === 0) {
        return 'Blog not found a';
      }
      return blogs;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const blog = await this.blogRepository.findOneBy({ id });
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
      return await this.blogRepository.update(id, updateBlogInput as any);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      return await this.blogRepository.delete(id);
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
      const users = await this.userRepository.find();
      const blogs: Blog[] = [];
      blogsdata.forEach((blogdata) => {
        const user =
          users[faker.datatype.number({ min: 0, max: users.length - 1 })];

        const blog = new Blog({
          content: blogdata.content,
          description: blogdata.description,
          title: blogdata.title,
          owner: user,
        });
        blogs.push(blog);
      });

      return await this.blogRepository.insert(blogs);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async blogsByUserId(userId: number) {
    try {
      const blogs = await this.blogRepository
        .createQueryBuilder('blog')
        .where('blog.ownerId = :id', { id: userId })
        .getMany();
      return blogs;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
