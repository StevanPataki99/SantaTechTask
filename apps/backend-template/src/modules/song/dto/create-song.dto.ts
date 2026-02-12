import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty({
    example: 'Summer Vibes',
    description: 'Title of the song',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Artist name (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  artist?: string;

  @ApiProperty({
    example: 210,
    description: 'Duration of the song in seconds (optional)',
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationSec?: number;
}
