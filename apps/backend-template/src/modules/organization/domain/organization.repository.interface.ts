import { Organization } from './organization.entity';

export interface IOrganizationRepository {
  save(organization: Organization): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
  findByIds(ids: string[]): Promise<Organization[]>;
  findAll(): Promise<Organization[]>;
  delete(id: string): Promise<void>;
}

export const ORGANIZATION_REPOSITORY = 'ORGANIZATION_REPOSITORY';
