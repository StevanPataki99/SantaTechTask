import {
  Pitch as PrismaPitch,
  PitchTag as PrismaPitchTag,
  PitchTargetArtist as PrismaPitchTargetArtist,
  Tag as PrismaTag,
} from '@prisma/client';

export type PitchSchema = PrismaPitch;
export type PitchTagSchema = PrismaPitchTag;
export type PitchTargetArtistSchema = PrismaPitchTargetArtist;
export type TagSchema = PrismaTag;

export type PitchWithRelations = PrismaPitch & {
  tags: (PrismaPitchTag & { tag: PrismaTag })[];
  targetArtists: PrismaPitchTargetArtist[];
};
