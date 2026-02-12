import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Organization } from '../domain/organization.entity';
import {
  IOrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '../domain/organization.repository.interface';
import { Member, MemberType } from '../../member/domain/member.entity';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../member/domain/member.repository.interface';

@Injectable()
export class OrganizationApplicationService {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async createOrganization(
    name: string,
    slug: string,
    creatorUserId: string,
    logo?: string,
    metadata?: string,
  ): Promise<Organization> {
    const existingOrg = await this.organizationRepository.findBySlug(slug);
    if (existingOrg) {
      throw new ConflictException(
        'Organization with this slug already exists',
      );
    }

    const organization = Organization.create(name, slug, logo, metadata);
    const savedOrg = await this.organizationRepository.save(organization);

    const ownerMember = Member.create(
      creatorUserId,
      savedOrg.id,
      'owner',
      MemberType.MANAGER,
    );
    await this.memberRepository.save(ownerMember);

    return savedOrg;
  }

  async getOrganizationById(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization> {
    const organization = await this.organizationRepository.findBySlug(slug);
    if (!organization) {
      throw new NotFoundException(
        `Organization with slug "${slug}" not found`,
      );
    }
    return organization;
  }

  async getOrganizationsForUser(userId: string): Promise<Organization[]> {
    const memberships = await this.memberRepository.findByUserId(userId);
    if (memberships.length === 0) return [];
    const orgIds = memberships.map((m) => m.organizationId);
    return this.organizationRepository.findByIds(orgIds);
  }

  async updateOrganization(
    id: string,
    name?: string,
    slug?: string,
    logo?: string,
    metadata?: string,
  ): Promise<Organization> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    if (name) organization.updateName(name);

    if (slug) {
      const existingOrg = await this.organizationRepository.findBySlug(slug);
      if (existingOrg && existingOrg.id !== id) {
        throw new ConflictException(
          'Organization with this slug already exists',
        );
      }
      organization.updateSlug(slug);
    }

    if (logo !== undefined) organization.updateLogo(logo);
    if (metadata !== undefined) organization.updateMetadata(metadata);

    return this.organizationRepository.save(organization);
  }

  async deleteOrganization(id: string): Promise<void> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    await this.organizationRepository.delete(id);
  }
}
