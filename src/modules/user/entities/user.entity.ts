import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Column, Entity, ObjectID, ObjectIdColumn, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @ObjectIdColumn()
  @Field(() => String)
  _id: ObjectID;

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

  @OneToMany(() => Blog, (blog) => blog.owner)
  blogs: Blog[];

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
