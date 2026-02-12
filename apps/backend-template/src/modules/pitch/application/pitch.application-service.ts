import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pitch, PitchTag, TargetArtist } from '../domain/pitch.entity';
import {
  IPitchRepository,
  PITCH_REPOSITORY,
} from '../domain/pitch.repository.interface';
import {
  ISongRepository,
  SONG_REPOSITORY,
} from '../../song/domain/song.repository.interface';

@Injectable()
export class PitchApplicationService {
  constructor(
    @Inject(PITCH_REPOSITORY)
    private readonly pitchRepository: IPitchRepository,
    @Inject(SONG_REPOSITORY)
    private readonly songRepository: ISongRepository,
  ) {}

  async createPitch(
    organizationId: string,
    createdById: string,
    songId: string,
    description?: string | null,
    tagNames?: string[],
    targetArtistNames?: string[],
  ): Promise<Pitch> {
    // Verify the song exists and belongs to the same org
    const song = await this.songRepository.findById(songId);
    if (!song) {
      throw new NotFoundException(`Song with ID ${songId} not found`);
    }
    if (song.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Song does not belong to this organization',
      );
    }

    // Build tag value objects (tagId is a placeholder; repo will upsert)
    const tags = (tagNames ?? []).map((name) =>
      PitchTag.create(crypto.randomUUID(), name),
    );

    // Build target artist value objects
    const targetArtists = (targetArtistNames ?? []).map((name) =>
      TargetArtist.create(name),
    );

    const pitch = Pitch.create(
      organizationId,
      songId,
      createdById,
      description,
      tags,
      targetArtists,
    );

    return this.pitchRepository.save(pitch);
  }

  async getPitchById(id: string, organizationId: string): Promise<Pitch> {
    const pitch = await this.pitchRepository.findById(id);
    if (!pitch) {
      throw new NotFoundException(`Pitch with ID ${id} not found`);
    }
    if (pitch.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Pitch does not belong to this organization',
      );
    }
    return pitch;
  }

  async getPitchesByOrganization(organizationId: string): Promise<Pitch[]> {
    return this.pitchRepository.findByOrganizationId(organizationId);
  }

  async getPitchesBySong(
    songId: string,
    organizationId: string,
  ): Promise<Pitch[]> {
    // Verify the song belongs to the org
    const song = await this.songRepository.findById(songId);
    if (!song) {
      throw new NotFoundException(`Song with ID ${songId} not found`);
    }
    if (song.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Song does not belong to this organization',
      );
    }
    return this.pitchRepository.findBySongId(songId);
  }

  async updatePitch(
    id: string,
    organizationId: string,
    description?: string | null,
    tagNames?: string[],
    targetArtistNames?: string[],
  ): Promise<Pitch> {
    const pitch = await this.pitchRepository.findById(id);
    if (!pitch) {
      throw new NotFoundException(`Pitch with ID ${id} not found`);
    }
    if (pitch.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Pitch does not belong to this organization',
      );
    }

    if (description !== undefined) {
      pitch.updateDescription(description);
    }

    if (tagNames !== undefined) {
      const tags = tagNames.map((name) =>
        PitchTag.create(crypto.randomUUID(), name),
      );
      pitch.replaceTags(tags);
    }

    if (targetArtistNames !== undefined) {
      const targetArtists = targetArtistNames.map((name) =>
        TargetArtist.create(name),
      );
      pitch.replaceTargetArtists(targetArtists);
    }

    return this.pitchRepository.save(pitch);
  }

  async deletePitch(id: string, organizationId: string): Promise<void> {
    const pitch = await this.pitchRepository.findById(id);
    if (!pitch) {
      throw new NotFoundException(`Pitch with ID ${id} not found`);
    }
    if (pitch.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Pitch does not belong to this organization',
      );
    }
    await this.pitchRepository.delete(id);
  }
}
