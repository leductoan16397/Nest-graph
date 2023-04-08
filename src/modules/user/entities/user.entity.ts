import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { BaseEntity } from 'src/modules/common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Column()
  @Field(() => String, { nullable: true })
  firstName: string;

  @Column()
  @Field(() => String, { nullable: true })
  sex: string;

  @Column()
  @Field(() => String, { nullable: true })
  lastName: string;

  @Column()
  @Field(() => Int, { nullable: true })
  age: number;

  @Column()
  @Field(() => String, { nullable: true })
  address: string;

  @Column()
  @Field(() => String, { nullable: true })
  avatar: string;

  @OneToMany(() => Blog, (blog) => blog.owner, {})
  blogs?: Blog[];

  constructor(user: Omit<User, 'id' | 'blogs' | 'createdAt' | 'updatedAt'>) {
    super();
    Object.assign(this, user);
  }
}
