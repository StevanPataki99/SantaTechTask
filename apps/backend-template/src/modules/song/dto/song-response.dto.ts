import { ApiProperty } from '@nestjs/swagger';

export class SongResponseDto {
  @ApiProperty({
    example: 'ckz1234567890',
    description: 'The unique identifier of the song',
  })
  id: string;

  @ApiProperty({
    example: 'org-id-123',
    description: 'The organization ID',
  })
  organizationId: string;

  @ApiProperty({
    example: 'user-id-123',
    description: 'The ID of the user who uploaded the song',
  })
  uploaderId: string;

  @ApiProperty({
    example: 'Summer Vibes',
    description: 'Title of the song',
  })
  title: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Artist name',
    nullable: true,
  })
  artist: string | null;

  @ApiProperty({
    example: 210,
    description: 'Duration of the song in seconds',
    nullable: true,
  })
  durationSec: number | null;

  @ApiProperty({
    example: 'summer_vibes.mp3',
    description: 'Original file name',
  })
  fileName: string;

  @ApiProperty({
    example: 'audio/mpeg',
    description: 'MIME type of the file',
  })
  mimeType: string;

  @ApiProperty({
    example: '5242880',
    description: 'File size in bytes',
  })
  sizeBytes: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  static fromAggregate(song: {
    id: string;
    organizationId: string;
    uploaderId: string;
    title: string;
    artist: string | null;
    durationSec: number | null;
    fileName: string;
    mimeType: string;
    sizeBytes: bigint;
    createdAt: Date;
    updatedAt: Date;
  }): SongResponseDto {
    const dto = new SongResponseDto();
    dto.id = song.id;
    dto.organizationId = song.organizationId;
    dto.uploaderId = song.uploaderId;
    dto.title = song.title;
    dto.artist = song.artist;
    dto.durationSec = song.durationSec;
    dto.fileName = song.fileName;
    dto.mimeType = song.mimeType;
    dto.sizeBytes = song.sizeBytes.toString();
    dto.createdAt = song.createdAt;
    dto.updatedAt = song.updatedAt;
    return dto;
  }
}
