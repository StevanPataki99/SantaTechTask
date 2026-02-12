import { ApiProperty } from '@nestjs/swagger';

export class PitchTargetArtistResponseDto {
  @ApiProperty({ example: 'target-artist-id-123' })
  id: string;

  @ApiProperty({ example: 'Dua Lipa' })
  name: string;
}

export class PitchTagResponseDto {
  @ApiProperty({ example: 'tag-id-123' })
  tagId: string;

  @ApiProperty({ example: 'pop' })
  name: string;
}

export class PitchResponseDto {
  @ApiProperty({
    example: 'ckz1234567890',
    description: 'The unique identifier of the pitch',
  })
  id: string;

  @ApiProperty({
    example: 'org-id-123',
    description: 'The organization ID',
  })
  organizationId: string;

  @ApiProperty({
    example: 'song-id-123',
    description: 'The song ID this pitch is for',
  })
  songId: string;

  @ApiProperty({
    example: 'user-id-123',
    description: 'The ID of the user who created the pitch',
  })
  createdById: string;

  @ApiProperty({
    example: 'Upbeat pop track with strong hook',
    description: 'Description of the pitch',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: [PitchTagResponseDto],
    description: 'Tags associated with the pitch',
  })
  tags: PitchTagResponseDto[];

  @ApiProperty({
    type: [PitchTargetArtistResponseDto],
    description: 'Target artists for the pitch',
  })
  targetArtists: PitchTargetArtistResponseDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  static fromAggregate(pitch: {
    id: string;
    organizationId: string;
    songId: string;
    createdById: string;
    description: string | null;
    tags: ReadonlyArray<{ tagId: string; name: string }>;
    targetArtists: ReadonlyArray<{ id: string; name: string }>;
    createdAt: Date;
    updatedAt: Date;
  }): PitchResponseDto {
    const dto = new PitchResponseDto();
    dto.id = pitch.id;
    dto.organizationId = pitch.organizationId;
    dto.songId = pitch.songId;
    dto.createdById = pitch.createdById;
    dto.description = pitch.description;
    dto.tags = pitch.tags.map((t) => ({
      tagId: t.tagId,
      name: t.name,
    }));
    dto.targetArtists = pitch.targetArtists.map((a) => ({
      id: a.id,
      name: a.name,
    }));
    dto.createdAt = pitch.createdAt;
    dto.updatedAt = pitch.updatedAt;
    return dto;
  }
}
