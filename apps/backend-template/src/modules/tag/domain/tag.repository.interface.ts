import { Tag } from './tag.entity';

export interface ITagRepository {
  save(tag: Tag): Promise<Tag>;
  findById(id: string): Promise<Tag | null>;
  findByOrganizationId(organizationId: string): Promise<Tag[]>;
  findByName(organizationId: string, name: string): Promise<Tag | null>;
  delete(id: string): Promise<void>;
}

export const TAG_REPOSITORY = 'TAG_REPOSITORY';
