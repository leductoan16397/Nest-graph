import { BlogModule } from './../blog/blog.module';
import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => BlogModule)],
  providers: [CommentResolver, CommentService, PrismaService],
  exports: [CommentService],
})
export class CommentModule {}
