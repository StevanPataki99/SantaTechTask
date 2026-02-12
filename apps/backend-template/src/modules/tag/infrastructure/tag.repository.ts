import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ITagRepository } from '../domain/tag.repository.interface';
import { Tag } from '../domain/tag.entity';
import { TagMapper } from './tag.mapper';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(tag: Tag): Promise<Tag> {
    const data = TagMapper.toPersistence(tag);

    const saved = await this.prisma.tag.upsert({
      where: {
        organizationId_name: {
          organizationId: data.organizationId,
          name: data.name,
        },
      },
      update: {
        name: data.name,
      },
      create: {
        id: data.id,
        organizationId: data.organizationId,
        name: data.name,
      },
    });

    return TagMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) return null;
    return TagMapper.toDomain(tag);
  }

  async findByOrganizationId(organizationId: string): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
    return tags.map(TagMapper.toDomain);
  }

  async findByName(
    organizationId: string,
    name: string,
  ): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        organizationId_name: {
          organizationId,
          name,
        },
      },
    });
    if (!tag) return null;
    return TagMapper.toDomain(tag);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({
      where: { id },
    });
  }
}
