import { Tag as PrismaTag } from '@prisma/client';
import { Tag } from '../domain/tag.entity';

export class TagMapper {
  static toDomain(raw: PrismaTag): Tag {
    return Tag.reconstitute(raw.id, raw.organizationId, raw.name);
  }

  static toPersistence(tag: Tag): PrismaTag {
    return {
      id: tag.id,
      organizationId: tag.organizationId,
      name: tag.name,
    } as PrismaTag;
  }
}
