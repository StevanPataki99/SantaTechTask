import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ISongRepository } from '../domain/song.repository.interface';
import { Song } from '../domain/song.entity';
import { SongMapper } from './song.mapper';

@Injectable()
export class SongRepository implements ISongRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(song: Song): Promise<Song> {
    const data = SongMapper.toPersistence(song);

    const saved = await this.prisma.song.upsert({
      where: { id: song.id },
      update: {
        title: data.title,
        artist: data.artist,
        durationSec: data.durationSec,
        updatedAt: new Date(),
      },
      create: {
        id: data.id,
        organizationId: data.organizationId,
        uploaderId: data.uploaderId,
        title: data.title,
        artist: data.artist,
        durationSec: data.durationSec,
        filePath: data.filePath,
        fileName: data.fileName,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
      },
    });

    return SongMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Song | null> {
    const song = await this.prisma.song.findUnique({
      where: { id },
    });
    if (!song) return null;
    return SongMapper.toDomain(song);
  }

  async findByOrganizationId(organizationId: string): Promise<Song[]> {
    const songs = await this.prisma.song.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return songs.map(SongMapper.toDomain);
  }

  async findByUploaderId(
    uploaderId: string,
    organizationId: string,
  ): Promise<Song[]> {
    const songs = await this.prisma.song.findMany({
      where: { uploaderId, organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return songs.map(SongMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.song.delete({
      where: { id },
    });
  }
}
