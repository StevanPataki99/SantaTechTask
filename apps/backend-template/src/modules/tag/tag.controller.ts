import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { SessionGuard } from '../../common/guards/session.guard';
import { TagApplicationService } from './application';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';

@ApiTags('tags')
@Controller('organizations/:orgId/tags')
@UseGuards(SessionGuard, OrgMemberGuard)
export class TagController {
  constructor(
    private readonly tagAppService: TagApplicationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new tag in the organization',
  })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
    type: TagResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Tag already exists.' })
  async createTag(
    @Param('orgId') orgId: string,
    @Body() dto: CreateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.tagAppService.createTag(orgId, dto.name);
    return TagResponseDto.fromAggregate(tag);
  }

  @Get()
  @ApiOperation({ summary: 'List all tags in the organization' })
  @ApiResponse({
    status: 200,
    description: 'List of tags.',
    type: [TagResponseDto],
  })
  async listTags(
    @Param('orgId') orgId: string,
  ): Promise<TagResponseDto[]> {
    const tags = await this.tagAppService.getTagsByOrganization(orgId);
    return tags.map((t) => TagResponseDto.fromAggregate(t));
  }

  @Get(':tagId')
  @ApiOperation({ summary: 'Get a specific tag' })
  @ApiResponse({
    status: 200,
    description: 'Return the tag.',
    type: TagResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async getTag(
    @Param('orgId') orgId: string,
    @Param('tagId') tagId: string,
  ): Promise<TagResponseDto> {
    const tag = await this.tagAppService.getTagById(tagId, orgId);
    return TagResponseDto.fromAggregate(tag);
  }

  @Delete(':tagId')
  @ApiOperation({ summary: 'Delete a tag from the organization' })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async deleteTag(
    @Param('orgId') orgId: string,
    @Param('tagId') tagId: string,
  ): Promise<void> {
    await this.tagAppService.deleteTag(tagId, orgId);
  }
}
