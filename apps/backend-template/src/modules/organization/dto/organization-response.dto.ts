import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({
    example: 'ckz1234567890',
    description: 'The unique identifier of the organization',
  })
  id: string;

  @ApiProperty({
    example: 'My Organization',
    description: 'The name of the organization',
  })
  name: string;

  @ApiProperty({
    example: 'my-organization',
    description: 'URL-friendly unique identifier',
  })
  slug: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'URL of the organization logo',
    nullable: true,
  })
  logo: string | null;

  @ApiProperty({
    example: '{"industry": "music"}',
    description: 'Additional metadata',
    nullable: true,
  })
  metadata: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  static fromAggregate(organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    metadata: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): OrganizationResponseDto {
    const dto = new OrganizationResponseDto();
    dto.id = organization.id;
    dto.name = organization.name;
    dto.slug = organization.slug;
    dto.logo = organization.logo;
    dto.metadata = organization.metadata;
    dto.createdAt = organization.createdAt;
    dto.updatedAt = organization.updatedAt;
    return dto;
  }
}
