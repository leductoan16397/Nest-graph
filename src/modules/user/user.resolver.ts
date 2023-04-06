import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Blog } from '../blog/entities/blog.entity';
import { BlogService } from '../blog/blog.service';
// import { ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ObjectID } from 'typeorm';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User])
  users(
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
    return this.userService.find({ page, perPage });
  }

  @Query(() => User)
  user(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne({ where: { _id: new ObjectId(id) } });
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.findByIdAndUpdate(
      updateUserInput.id,
      updateUserInput,
    );
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    const objectId = ObjectId.createFromHexString(id);

    return this.userService.findByIdAndDelete(objectId as unknown as ObjectID);
  }

  @Mutation(() => [User])
  initUsers() {
    return this.userService.initUsers();
  }

  @ResolveField(() => [Blog], {})
  async blogs(@Parent() user: User) {
    const { _id: userId } = user;
    return await this.blogService.find({ filter: { owner: userId } });
  }
}
