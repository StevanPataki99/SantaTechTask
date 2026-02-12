import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'My Organization',
    description: 'The name of the organization',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'my-organization',
    description: 'URL-friendly unique identifier for the organization',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be URL-friendly (lowercase alphanumeric with hyphens)',
  })
  slug: string;

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
