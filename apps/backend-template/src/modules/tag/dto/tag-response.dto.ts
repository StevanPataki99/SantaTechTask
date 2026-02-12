import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({
    example: 'tag-id-123',
    description: 'The unique identifier of the tag',
  })
  id: string;

  @ApiProperty({
    example: 'org-id-123',
    description: 'The organization ID',
  })
  organizationId: string;

  @ApiProperty({
    example: 'pop',
    description: 'Tag name',
  })
  name: string;

  static fromAggregate(tag: {
    id: string;
    organizationId: string;
    name: string;
  }): TagResponseDto {
    const dto = new TagResponseDto();
    dto.id = tag.id;
    dto.organizationId = tag.organizationId;
    dto.name = tag.name;
    return dto;
  }
}
