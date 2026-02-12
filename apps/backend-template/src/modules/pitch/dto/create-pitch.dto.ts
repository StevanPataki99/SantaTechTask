import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePitchDto {
  @ApiProperty({
    example: 'song-id-123',
    description: 'The ID of the song to pitch',
  })
  @IsString()
  @IsNotEmpty()
  songId: string;

  @ApiProperty({
    example: 'Upbeat pop track with strong hook',
    description: 'Description of the pitch',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['pop', 'upbeat', 'radio'],
    description: 'List of tag names for the pitch',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: ['Dua Lipa', 'Ariana Grande'],
    description: 'List of target artist names',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetArtists?: string[];
}
