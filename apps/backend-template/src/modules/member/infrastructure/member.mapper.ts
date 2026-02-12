import { Member as PrismaMember } from '@prisma/client';
import { Member, MemberRole, MemberType } from '../domain/member.entity';

export class MemberMapper {
  static toDomain(raw: PrismaMember): Member {
    return Member.reconstitute(
      raw.id,
      raw.userId,
      raw.organizationId,
      raw.role as MemberRole,
      raw.type as unknown as MemberType,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(member: Member): PrismaMember {
    return {
      id: member.id,
      userId: member.userId,
      organizationId: member.organizationId,
      role: member.role,
      type: member.type,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    } as PrismaMember;
  }
}
