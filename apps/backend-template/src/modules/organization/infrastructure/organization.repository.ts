import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { IOrganizationRepository } from '../domain/organization.repository.interface';
import { Organization } from '../domain/organization.entity';
import { OrganizationMapper } from './organization.mapper';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(organization: Organization): Promise<Organization> {
    const data = OrganizationMapper.toPersistence(organization);

    const saved = await this.prisma.organization.upsert({
      where: { id: organization.id },
      update: {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        metadata: data.metadata,
        updatedAt: new Date(),
      },
      create: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        metadata: data.metadata,
      },
    });

    return OrganizationMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });
    if (!org) return null;
    return OrganizationMapper.toDomain(org);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
    });
    if (!org) return null;
    return OrganizationMapper.toDomain(org);
  }

  async findByIds(ids: string[]): Promise<Organization[]> {
    const orgs = await this.prisma.organization.findMany({
      where: { id: { in: ids } },
    });
    return orgs.map(OrganizationMapper.toDomain);
  }

  async findAll(): Promise<Organization[]> {
    const orgs = await this.prisma.organization.findMany();
    return orgs.map(OrganizationMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({
      where: { id },
    });
  }
}
