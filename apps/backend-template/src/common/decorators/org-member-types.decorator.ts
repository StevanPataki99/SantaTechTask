import { SetMetadata } from '@nestjs/common';
import { MemberType } from '../../modules/member/domain/member.entity';

export const ORG_MEMBER_TYPES_KEY = 'orgMemberTypes';
export const OrgMemberTypes = (...types: MemberType[]) =>
  SetMetadata(ORG_MEMBER_TYPES_KEY, types);
