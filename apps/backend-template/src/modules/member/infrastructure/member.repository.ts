import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { IMemberRepository } from '../domain/member.repository.interface';
import { Member } from '../domain/member.entity';
import { MemberMapper } from './member.mapper';
import { MemberType as PrismaMemberType } from '@prisma/client';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(member: Member): Promise<Member> {
    const data = MemberMapper.toPersistence(member);

    const saved = await this.prisma.member.upsert({
      where: { id: member.id },
      update: {
        role: data.role,
        type: data.type as PrismaMemberType,
        updatedAt: new Date(),
      },
      create: {
        id: data.id,
        userId: data.userId,
        organizationId: data.organizationId,
        role: data.role,
        type: data.type as PrismaMemberType,
      },
    });

    return MemberMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: { id },
    });
    if (!member) return null;
    return MemberMapper.toDomain(member);
  }

  async findByUserAndOrg(
    userId: string,
    organizationId: string,
  ): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });
    if (!member) return null;
    return MemberMapper.toDomain(member);
  }

  async findByOrganizationId(organizationId: string): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { organizationId },
    });
    return members.map(MemberMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Member[]> {
    const members = await this.prisma.member.findMany({
      where: { userId },
    });
    return members.map(MemberMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.member.delete({
      where: { id },
    });
  }
}
