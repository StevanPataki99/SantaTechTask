import { Song as PrismaSong } from '@prisma/client';
import { Song } from '../domain/song.entity';

export class SongMapper {
  static toDomain(raw: PrismaSong): Song {
    return Song.reconstitute(
      raw.id,
      raw.organizationId,
      raw.uploaderId,
      raw.title,
      raw.artist,
      raw.durationSec,
      raw.filePath,
      raw.fileName,
      raw.mimeType,
      raw.sizeBytes,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(song: Song): PrismaSong {
    return {
      id: song.id,
      organizationId: song.organizationId,
      uploaderId: song.uploaderId,
      title: song.title,
      artist: song.artist,
      durationSec: song.durationSec,
      filePath: song.filePath,
      fileName: song.fileName,
      mimeType: song.mimeType,
      sizeBytes: song.sizeBytes,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
    } as PrismaSong;
  }
}
