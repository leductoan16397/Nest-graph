import { Module } from '@nestjs/common';
import { LoggingPlugin } from './apolloLogging.service';

@Module({
  providers: [LoggingPlugin],
})
export class CommonModule {}
