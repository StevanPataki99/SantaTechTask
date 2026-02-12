import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({
    example: 'user-id-123',
    description: 'The ID of the user to add as a member',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'member',
    description: 'Permission role in the organization',
    enum: ['owner', 'admin', 'member'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['owner', 'admin', 'member'])
  role: string;

  @ApiProperty({
    example: 'SONGWRITER',
    description: 'App role/persona in the organization',
    enum: ['MANAGER', 'SONGWRITER'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['MANAGER', 'SONGWRITER'])
  type: string;
}
