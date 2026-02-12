import { Member } from './member.entity';

export interface IMemberRepository {
  save(member: Member): Promise<Member>;
  findById(id: string): Promise<Member | null>;
  findByUserAndOrg(
    userId: string,
    organizationId: string,
  ): Promise<Member | null>;
  findByOrganizationId(organizationId: string): Promise<Member[]>;
  findByUserId(userId: string): Promise<Member[]>;
  delete(id: string): Promise<void>;
}

export const MEMBER_REPOSITORY = 'MEMBER_REPOSITORY';
