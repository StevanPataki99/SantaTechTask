import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '../../modules/member/domain/member.entity';

export const ORG_ROLES_KEY = 'orgRoles';
export const OrgRoles = (...roles: MemberRole[]) =>
  SetMetadata(ORG_ROLES_KEY, roles);
