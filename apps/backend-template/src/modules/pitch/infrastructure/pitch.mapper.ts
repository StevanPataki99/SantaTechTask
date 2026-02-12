import { Pitch, PitchTag, TargetArtist } from '../domain/pitch.entity';
import { PitchWithRelations } from './pitch.schema';

export class PitchMapper {
  static toDomain(raw: PitchWithRelations): Pitch {
    const tags = raw.tags.map((pt) => PitchTag.create(pt.tag.id, pt.tag.name));
    const targetArtists = raw.targetArtists.map((ta) =>
      TargetArtist.reconstitute(ta.id, ta.name),
    );

    return Pitch.reconstitute(
      raw.id,
      raw.organizationId,
      raw.songId,
      raw.createdById,
      raw.description,
      tags,
      targetArtists,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
