import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/common/base.entity';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class Comment extends BaseEntity {
  @Field(() => String, {})
  content: string;

  @Field(() => User, {})
  owner: User;
}
