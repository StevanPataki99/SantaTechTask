import { IsOptional, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiProperty({
    example: 'My Updated Organization',
    description: 'The name of the organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'my-updated-organization',
    description: 'URL-friendly unique identifier for the organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be URL-friendly (lowercase alphanumeric with hyphens)',
  })
  slug?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'URL of the organization logo',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    example: '{"industry": "music"}',
    description: 'Additional metadata for the organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  metadata?: string;
}
