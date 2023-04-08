import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from 'src/modules/common/base.entity';

@ObjectType()
export class User extends BaseEntity {
  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  sex: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => Int, { nullable: true })
  age: number;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  avatar: string;
}
