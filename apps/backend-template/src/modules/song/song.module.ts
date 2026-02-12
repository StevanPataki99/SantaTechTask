import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { SONG_REPOSITORY } from './domain/song.repository.interface';
import { SongApplicationService } from './application';
import { SongController } from './song.controller';
import { SongRepository } from './infrastructure/song.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [SongController],
  providers: [
    SongApplicationService,
    {
      provide: SONG_REPOSITORY,
      useClass: SongRepository,
    },
  ],
  exports: [SongApplicationService, SONG_REPOSITORY],
})
export class SongModule {}
