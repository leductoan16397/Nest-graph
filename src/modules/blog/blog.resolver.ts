import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { Blog } from './entities/blog.entity';
import { CommentService } from '../comment/comment.service';
import { Blog as PrismaBlog } from '@prisma/client';

@Resolver(() => Blog)
export class BlogResolver {
  constructor(
    private readonly blogService: BlogService,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  @Mutation(() => Blog)
  async createBlog(@Args('createBlogInput') createBlogInput: CreateBlogInput) {
    return await this.blogService.create(createBlogInput);
  }

  @Query(() => [Blog], { name: 'blogs' })
  async blogs(
    @Args('page', {
      type: () => Int,
      nullable: true,
      defaultValue: undefined,
    })
    page: number,
    @Args('perPage', {
      type: () => Int,
      nullable: true,
      defaultValue: undefined,
    })
    perPage: number,
  ) {
    return await this.blogService.find({ page, perPage });
  }

  @Query(() => Blog)
  async blog(@Args('id', { type: () => Int }) id: number) {
    return await this.blogService.findOne(id);
  }

  @Mutation(() => Blog, { name: 'updateBlog' })
  async updateBlog(@Args('updateBlogInput') updateBlogInput: UpdateBlogInput) {
    return await this.blogService.findByIdAndUpdate(
      updateBlogInput.id,
      updateBlogInput,
    );
  }

  @Mutation(() => Blog, { name: 'removeBlog' })
  async removeBlog(@Args('id', { type: () => Int }) id: number) {
    return await this.blogService.findByIdAndDelete(id);
  }

  @Mutation(() => [Blog])
  initBlogs() {
    return this.blogService.initBlogs();
  }

  @ResolveField()
  async owner(@Parent() blog: PrismaBlog) {
    const { ownerId } = blog;
    return await this.userService.findOne({
      id: ownerId,
    });
  }

  @ResolveField()
  async comments(@Parent() blog: Blog) {
    const { id: blogId } = blog;
    return await this.commentService.commentsByBlogId({ blogId });
  }
}
