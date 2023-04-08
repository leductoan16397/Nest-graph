import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { BlogModule } from '../blog/blog.module';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [forwardRef(() => BlogModule)],
  providers: [UserResolver, UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
