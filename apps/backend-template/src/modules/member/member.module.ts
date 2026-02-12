import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MEMBER_REPOSITORY } from './domain/member.repository.interface';
import { MemberApplicationService } from './application';
import { MemberController } from './member.controller';
import { MemberRepository } from './infrastructure/member.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MemberController],
  providers: [
    MemberApplicationService,
    {
      provide: MEMBER_REPOSITORY,
      useClass: MemberRepository,
    },
  ],
  exports: [MemberApplicationService, MEMBER_REPOSITORY],
})
export class MemberModule {}
