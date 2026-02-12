import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ORGANIZATION_REPOSITORY } from './domain/organization.repository.interface';
import { OrganizationApplicationService } from './application';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './infrastructure/organization.repository';

@Module({
  imports: [DatabaseModule, AuthModule, MemberModule],
  controllers: [OrganizationController],
  providers: [
    OrganizationApplicationService,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: OrganizationRepository,
    },
  ],
  exports: [OrganizationApplicationService],
})
export class OrganizationModule {}
