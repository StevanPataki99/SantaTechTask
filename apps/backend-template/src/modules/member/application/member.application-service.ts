import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member, MemberRole, MemberType } from '../domain/member.entity';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../domain/member.repository.interface';

@Injectable()
export class MemberApplicationService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async addMember(
    organizationId: string,
    userId: string,
    role: string,
    type: string,
  ): Promise<Member> {
    const existing = await this.memberRepository.findByUserAndOrg(
      userId,
      organizationId,
    );
    if (existing) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const member = Member.create(
      userId,
      organizationId,
      role as MemberRole,
      type as MemberType,
    );
    return this.memberRepository.save(member);
  }

  async getMemberById(id: string): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async getMemberByUserAndOrg(
    userId: string,
    organizationId: string,
  ): Promise<Member> {
    const member = await this.memberRepository.findByUserAndOrg(
      userId,
      organizationId,
    );
    if (!member) {
      throw new NotFoundException('Membership not found');
    }
    return member;
  }

  async getMembersByOrganization(organizationId: string): Promise<Member[]> {
    return this.memberRepository.findByOrganizationId(organizationId);
  }

  async getMembershipsForUser(userId: string): Promise<Member[]> {
    return this.memberRepository.findByUserId(userId);
  }

  async updateMember(
    id: string,
    role?: string,
    type?: string,
  ): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    if (role) {
      member.changeRole(role as MemberRole);
    }
    if (type) {
      member.changeType(type as MemberType);
    }

    return this.memberRepository.save(member);
  }

  async removeMember(id: string): Promise<void> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    if (member.isOwner()) {
      throw new Error('Cannot remove the owner of an organization');
    }
    await this.memberRepository.delete(id);
  }
}
