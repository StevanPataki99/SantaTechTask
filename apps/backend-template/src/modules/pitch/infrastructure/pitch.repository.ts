import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { IPitchRepository } from '../domain/pitch.repository.interface';
import { Pitch } from '../domain/pitch.entity';
import { PitchMapper } from './pitch.mapper';

const PITCH_INCLUDE = {
  tags: {
    include: {
      tag: true,
    },
  },
  targetArtists: true,
} as const;

@Injectable()
export class PitchRepository implements IPitchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(pitch: Pitch): Promise<Pitch> {
    const saved = await this.prisma.$transaction(async (tx) => {
      // Upsert the pitch record
      await tx.pitch.upsert({
        where: { id: pitch.id },
        update: {
          description: pitch.description,
          updatedAt: new Date(),
        },
        create: {
          id: pitch.id,
          organizationId: pitch.organizationId,
          songId: pitch.songId,
          createdById: pitch.createdById,
          description: pitch.description,
        },
      });

      // Replace tags: delete existing, upsert tags, recreate join rows
      await tx.pitchTag.deleteMany({ where: { pitchId: pitch.id } });

      for (const tag of pitch.tags) {
        // Upsert the tag in the org (ensure it exists)
        await tx.tag.upsert({
          where: {
            organizationId_name: {
              organizationId: pitch.organizationId,
              name: tag.name,
            },
          },
          update: {},
          create: {
            id: tag.tagId,
            organizationId: pitch.organizationId,
            name: tag.name,
          },
        });

        // Find the actual tag ID (in case it already existed)
        const existingTag = await tx.tag.findUnique({
          where: {
            organizationId_name: {
              organizationId: pitch.organizationId,
              name: tag.name,
            },
          },
        });

        if (existingTag) {
          await tx.pitchTag.create({
            data: {
              pitchId: pitch.id,
              tagId: existingTag.id,
            },
          });
        }
      }

      // Replace target artists: delete existing, recreate
      await tx.pitchTargetArtist.deleteMany({ where: { pitchId: pitch.id } });

      for (const artist of pitch.targetArtists) {
        await tx.pitchTargetArtist.create({
          data: {
            id: artist.id,
            pitchId: pitch.id,
            name: artist.name,
          },
        });
      }

      // Return the full pitch with relations
      return tx.pitch.findUniqueOrThrow({
        where: { id: pitch.id },
        include: PITCH_INCLUDE,
      });
    });

    return PitchMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Pitch | null> {
    const pitch = await this.prisma.pitch.findUnique({
      where: { id },
      include: PITCH_INCLUDE,
    });
    if (!pitch) return null;
    return PitchMapper.toDomain(pitch);
  }

  async findByOrganizationId(organizationId: string): Promise<Pitch[]> {
    const pitches = await this.prisma.pitch.findMany({
      where: { organizationId },
      include: PITCH_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return pitches.map(PitchMapper.toDomain);
  }

  async findBySongId(songId: string): Promise<Pitch[]> {
    const pitches = await this.prisma.pitch.findMany({
      where: { songId },
      include: PITCH_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return pitches.map(PitchMapper.toDomain);
  }

  async findByCreatedById(
    createdById: string,
    organizationId: string,
  ): Promise<Pitch[]> {
    const pitches = await this.prisma.pitch.findMany({
      where: { createdById, organizationId },
      include: PITCH_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return pitches.map(PitchMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pitch.delete({
      where: { id },
    });
  }
}
