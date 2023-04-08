import { ObjectType, Field } from '@nestjs/graphql';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { BaseEntity } from 'src/modules/common/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @Column()
  @Field(() => String, {})
  content: string;

  @Column({ nullable: true })
  ownerId: number;

  @Field(() => User, {})
  @ManyToOne(() => User, {})
  owner: User;

  @Column({ nullable: true })
  blogId: number;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  constructor(comment: Pick<Comment, 'owner' | 'blog' | 'content'>) {
    super();
    Object.assign(this, comment);
  }
}
