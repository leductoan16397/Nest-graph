import { Module, forwardRef } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { Blog } from './entities/blog.entity';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), forwardRef(() => UserModule)],
  providers: [BlogResolver, BlogService],
  exports: [BlogService, TypeOrmModule],
})
export class BlogModule {}
