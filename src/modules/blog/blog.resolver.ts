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

@Resolver(() => Blog)
export class BlogResolver {
  constructor(
    private readonly blogService: BlogService,
    private readonly userService: UserService,
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
  async blog(@Args('id', { type: () => String }) id: string) {
    return this.blogService.findOne({ _id: id });
  }

  @Mutation(() => Blog, { name: 'updateBlog' })
  async updateBlog(@Args('updateBlogInput') updateBlogInput: UpdateBlogInput) {
    return await this.blogService.findByIdAndUpdate(
      updateBlogInput.id,
      updateBlogInput,
    );
  }

  @Mutation(() => Blog, { name: 'removeBlog' })
  async removeBlog(@Args('id', { type: () => String }) id: string) {
    return await this.blogService.findByIdAndDelete(id);
  }

  @Mutation(() => Blog)
  async addComment(
    @Args('blogId', { type: () => String }) blogId: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('comment', { type: () => String }) comment: string,
  ) {
    return await this.blogService.addComment({ blogId, comment, userId });
  }

  @Mutation(() => [Blog])
  initBlogs() {
    return this.blogService.initBlogs();
  }

  @ResolveField()
  async owner(@Parent() blog: Blog) {
    const { owner } = blog;
    return await this.userService.findOne({ _id: owner });
  }
}
