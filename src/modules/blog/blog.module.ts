import { Module, forwardRef } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comment/comment.module';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => CommentModule)],
  providers: [BlogResolver, BlogService, PrismaService],
  exports: [BlogService],
})
export class BlogModule {}
