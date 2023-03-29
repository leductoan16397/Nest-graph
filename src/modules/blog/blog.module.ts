import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './entities/blog.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [BlogResolver, BlogService],
  exports: [BlogService, MongooseModule],
})
export class BlogModule {}
