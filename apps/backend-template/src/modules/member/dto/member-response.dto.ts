import { ApiProperty } from '@nestjs/swagger';

export class MemberResponseDto {
  @ApiProperty({
    example: 'ckz1234567890',
    description: 'The unique identifier of the membership',
  })
  id: string;

  @ApiProperty({
    example: 'user-id-123',
    description: 'The user ID',
  })
  userId: string;

  @ApiProperty({
    example: 'org-id-123',
    description: 'The organization ID',
  })
  organizationId: string;

  @ApiProperty({
    example: 'member',
    description: 'Permission role in the organization (owner/admin/member)',
  })
  role: string;

  @ApiProperty({
    example: 'SONGWRITER',
    description: 'App role/persona in the organization (MANAGER/SONGWRITER)',
  })
  type: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  static fromAggregate(member: {
    id: string;
    userId: string;
    organizationId: string;
    role: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
  }): MemberResponseDto {
    const dto = new MemberResponseDto();
    dto.id = member.id;
    dto.userId = member.userId;
    dto.organizationId = member.organizationId;
    dto.role = member.role;
    dto.type = member.type;
    dto.createdAt = member.createdAt;
    dto.updatedAt = member.updatedAt;
    return dto;
  }
}
