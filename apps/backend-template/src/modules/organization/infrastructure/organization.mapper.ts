import { Organization as PrismaOrganization } from '@prisma/client';
import { Organization } from '../domain/organization.entity';

export class OrganizationMapper {
  static toDomain(raw: PrismaOrganization): Organization {
    return Organization.reconstitute(
      raw.id,
      raw.name,
      raw.slug,
      raw.logo,
      raw.metadata,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(organization: Organization): PrismaOrganization {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      metadata: organization.metadata,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    } as PrismaOrganization;
  }
}
