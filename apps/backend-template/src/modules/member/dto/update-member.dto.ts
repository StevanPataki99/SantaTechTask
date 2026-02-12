import { IsIn, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiProperty({
    example: 'admin',
    description: 'Permission role in the organization',
    enum: ['owner', 'admin', 'member'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['owner', 'admin', 'member'])
  role?: string;

  @ApiProperty({
    example: 'SONGWRITER',
    description: 'App role/persona in the organization',
    enum: ['MANAGER', 'SONGWRITER'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['MANAGER', 'SONGWRITER'])
  type?: string;
}
