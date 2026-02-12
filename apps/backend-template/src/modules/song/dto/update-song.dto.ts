import { IsInt, IsOptional, IsString, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateSongDto {
  @ApiProperty({
    example: 'Summer Vibes (Remix)',
    description: 'Updated title of the song',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'John Doe ft. Jane',
    description: 'Updated artist name',
    required: false,
  })
  @IsString()
  @IsOptional()
  artist?: string;

  @ApiProperty({
    example: 225,
    description: 'Updated duration of the song in seconds',
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationSec?: number;
}
