import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { SongModule } from '../song/song.module';
import { PITCH_REPOSITORY } from './domain/pitch.repository.interface';
import { PitchApplicationService } from './application';
import { PitchController } from './pitch.controller';
import { PitchRepository } from './infrastructure/pitch.repository';

@Module({
  imports: [DatabaseModule, AuthModule, SongModule],
  controllers: [PitchController],
  providers: [
    PitchApplicationService,
    {
      provide: PITCH_REPOSITORY,
      useClass: PitchRepository,
    },
  ],
  exports: [PitchApplicationService, PITCH_REPOSITORY],
})
export class PitchModule {}
