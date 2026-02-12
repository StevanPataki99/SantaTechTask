import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { TAG_REPOSITORY } from './domain/tag.repository.interface';
import { TagApplicationService } from './application';
import { TagController } from './tag.controller';
import { TagRepository } from './infrastructure/tag.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TagController],
  providers: [
    TagApplicationService,
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
  ],
  exports: [TagApplicationService, TAG_REPOSITORY],
})
export class TagModule {}
