import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    example: 'pop',
    description: 'Name of the tag',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
