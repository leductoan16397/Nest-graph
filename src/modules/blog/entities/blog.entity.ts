import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@ObjectType()
export class Comment {
  @Column()
  @Field(() => String, { nullable: true })
  content: string;

  // @Column()
  // @Field(() => String)
  // owner: User;
}

@Entity()
@ObjectType()
export class Blog {
  @ObjectIdColumn()
  @Field(() => String)
  _id: ObjectID;

  @Column()
  @Field(() => String, { nullable: true })
  content: string;

  @Column()
  @Field(() => String, {
    description: 'Blog Title',
    nullable: true,
    defaultValue: '',
  })
  title: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.blogs)
  owner: User | ObjectID;

  @Column()
  @Field(() => String, { nullable: true, description: 'Blog Description' })
  description: string;

  @Column(() => Comment)
  @Field(() => Comment, { nullable: true })
  comments: Comment[];

  constructor(blog?: Partial<Blog>) {
    Object.assign(this, blog);
  }
}
