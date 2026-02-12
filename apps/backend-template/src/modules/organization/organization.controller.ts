import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrgRoles } from '../../common/decorators/org-roles.decorator';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { SessionGuard } from '../../common/guards/session.guard';
import { extractUserId } from '../../common/utils/extract-user-id';
import { OrganizationApplicationService } from './application';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(SessionGuard)
export class OrganizationController {
  constructor(
    private readonly organizationAppService: OrganizationApplicationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new organization (current user becomes owner)',
  })
  @ApiResponse({
    status: 201,
    description: 'The organization has been successfully created.',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Slug already taken.' })
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: unknown,
  ): Promise<OrganizationResponseDto> {
    const userId = extractUserId(user);
    const organization = await this.organizationAppService.createOrganization(
      dto.name,
      dto.slug,
      userId,
      dto.logo,
      dto.metadata,
    );
    return OrganizationResponseDto.fromAggregate(organization);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations the user belongs to.',
    type: [OrganizationResponseDto],
  })
  async findMyOrganizations(
    @CurrentUser() user: unknown,
  ): Promise<OrganizationResponseDto[]> {
    const userId = extractUserId(user);
    const organizations =
      await this.organizationAppService.getOrganizationsForUser(userId);
    return organizations.map((org) =>
      OrganizationResponseDto.fromAggregate(org),
    );
  }

  @Get(':id')
  @UseGuards(OrgMemberGuard)
  @ApiOperation({ summary: 'Get an organization by ID (members only)' })
  @ApiResponse({
    status: 200,
    description: 'Return the organization.',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Not a member / wrong active org.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  async findOne(@Param('id') id: string): Promise<OrganizationResponseDto> {
    const organization =
      await this.organizationAppService.getOrganizationById(id);
    return OrganizationResponseDto.fromAggregate(organization);
  }

  @Patch(':id')
  @UseGuards(OrgMemberGuard)
  @OrgRoles('owner', 'admin')
  @ApiOperation({ summary: 'Update an organization (owner/admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully updated.',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  @ApiResponse({ status: 409, description: 'Slug already taken.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    const organization =
      await this.organizationAppService.updateOrganization(
        id,
        dto.name,
        dto.slug,
        dto.logo,
        dto.metadata,
      );
    return OrganizationResponseDto.fromAggregate(organization);
  }

  @Delete(':id')
  @UseGuards(OrgMemberGuard)
  @OrgRoles('owner')
  @ApiOperation({ summary: 'Delete an organization (owner only)' })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.organizationAppService.deleteOrganization(id);
  }
}
