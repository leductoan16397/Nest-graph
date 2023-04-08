import { ObjectType, Field } from '@nestjs/graphql';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { BaseEntity } from 'src/modules/common/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Blog extends BaseEntity {
  @Column()
  @Field(() => String, {})
  content: string;

  @Field(() => String, {
    description: 'Blog Title',
    nullable: true,
    defaultValue: '',
  })
  @Column()
  title: string;

  @Field(() => String, { description: 'Blog Description' })
  @Column()
  description: string;

  @Column({ nullable: true })
  ownerId: number;

  @Field(() => User, {})
  @ManyToOne(() => User, (user) => user.blogs, {})
  owner: User;

  @Field(() => [Comment], { nullable: true, defaultValue: [] })
  @OneToMany(() => Comment, (comment) => comment.blog, {})
  comments: Comment[];

  constructor(blog: Pick<Blog, 'content' | 'description' | 'title' | 'owner'>) {
    super();
    Object.assign(this, blog);
  }
}
