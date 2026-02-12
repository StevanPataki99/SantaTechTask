import { IsArray, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdatePitchDto {
  @ApiProperty({
    example: 'Updated description for the pitch',
    description: 'Updated description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['pop', 'chill', 'summer'],
    description: 'Updated list of tag names (replaces existing)',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: ['Dua Lipa', 'The Weeknd'],
    description: 'Updated list of target artist names (replaces existing)',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetArtists?: string[];
}
