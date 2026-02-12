import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tag } from '../domain/tag.entity';
import {
  ITagRepository,
  TAG_REPOSITORY,
} from '../domain/tag.repository.interface';

@Injectable()
export class TagApplicationService {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async createTag(organizationId: string, name: string): Promise<Tag> {
    const existing = await this.tagRepository.findByName(
      organizationId,
      name.trim().toLowerCase(),
    );
    if (existing) {
      throw new ConflictException(
        `Tag "${name}" already exists in this organization`,
      );
    }

    const tag = Tag.create(organizationId, name);
    return this.tagRepository.save(tag);
  }

  async getTagById(id: string, organizationId: string): Promise<Tag> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    if (tag.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Tag does not belong to this organization',
      );
    }
    return tag;
  }

  async getTagsByOrganization(organizationId: string): Promise<Tag[]> {
    return this.tagRepository.findByOrganizationId(organizationId);
  }

  async deleteTag(id: string, organizationId: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    if (tag.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Tag does not belong to this organization',
      );
    }
    await this.tagRepository.delete(id);
  }
}
