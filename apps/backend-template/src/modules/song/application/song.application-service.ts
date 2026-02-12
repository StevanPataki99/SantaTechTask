import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Song } from '../domain/song.entity';
import {
  ISongRepository,
  SONG_REPOSITORY,
} from '../domain/song.repository.interface';

@Injectable()
export class SongApplicationService {
  constructor(
    @Inject(SONG_REPOSITORY)
    private readonly songRepository: ISongRepository,
  ) {}

  async createSong(
    organizationId: string,
    uploaderId: string,
    title: string,
    filePath: string,
    fileName: string,
    mimeType: string,
    sizeBytes: bigint,
    artist?: string | null,
    durationSec?: number | null,
  ): Promise<Song> {
    const song = Song.create(
      organizationId,
      uploaderId,
      title,
      filePath,
      fileName,
      mimeType,
      sizeBytes,
      artist,
      durationSec,
    );
    return this.songRepository.save(song);
  }

  async getSongById(id: string, organizationId: string): Promise<Song> {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    if (song.organizationId !== organizationId) {
      throw new ForbiddenException('Song does not belong to this organization');
    }
    return song;
  }

  async getSongsByOrganization(organizationId: string): Promise<Song[]> {
    return this.songRepository.findByOrganizationId(organizationId);
  }

  async getSongsByUploader(
    uploaderId: string,
    organizationId: string,
  ): Promise<Song[]> {
    return this.songRepository.findByUploaderId(uploaderId, organizationId);
  }

  async updateSong(
    id: string,
    organizationId: string,
    title?: string,
    artist?: string | null,
    durationSec?: number | null,
  ): Promise<Song> {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    if (song.organizationId !== organizationId) {
      throw new ForbiddenException('Song does not belong to this organization');
    }

    song.updateMetadata(title, artist, durationSec);
    return this.songRepository.save(song);
  }

  async deleteSong(id: string, organizationId: string): Promise<void> {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    if (song.organizationId !== organizationId) {
      throw new ForbiddenException('Song does not belong to this organization');
    }
    await this.songRepository.delete(id);
  }
}
