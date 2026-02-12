import { Song } from './song.entity';

export interface ISongRepository {
  save(song: Song): Promise<Song>;
  findById(id: string): Promise<Song | null>;
  findByOrganizationId(organizationId: string): Promise<Song[]>;
  findByUploaderId(uploaderId: string, organizationId: string): Promise<Song[]>;
  delete(id: string): Promise<void>;
}

export const SONG_REPOSITORY = 'SONG_REPOSITORY';
