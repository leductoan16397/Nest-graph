import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { UserService } from '../user/user.service';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.create(createCommentInput);
  }

  @ResolveField()
  async owner(@Parent() comment: Comment) {
    const { ownerId } = comment;
    return await this.userService.findOne({
      where: { id: ownerId },
    });
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentService.findByIdAndUpdate(
      updateCommentInput.id,
      updateCommentInput,
    );
  }

  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => Int }) id: number) {
    return this.commentService.findByIdAndDelete(id);
  }
}
