import { ObjectType, Field } from '@nestjs/graphql';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { BaseEntity } from 'src/modules/common/base.entity';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class Blog extends BaseEntity {
  @Field(() => String, {})
  content: string;

  @Field(() => String, {
    description: 'Blog Title',
    nullable: true,
    defaultValue: '',
  })
  title: string;

  @Field(() => String, { description: 'Blog Description' })
  description: string;

  @Field(() => User, {})
  owner: User;

  @Field(() => [Comment], { nullable: true, defaultValue: [] })
  comments: Comment[];
}
