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
import { MemberApplicationService } from './application';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberResponseDto } from './dto/member-response.dto';

@ApiTags('members')
@Controller('organizations/:orgId/members')
@UseGuards(SessionGuard, OrgMemberGuard)
export class MemberController {
  constructor(
    private readonly memberAppService: MemberApplicationService,
  ) {}

  @Post()
  @OrgRoles('owner', 'admin')
  @ApiOperation({
    summary: 'Add a member to an organization (owner/admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'The member has been successfully added.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 409, description: 'User is already a member.' })
  async addMember(
    @Param('orgId') orgId: string,
    @Body() dto: AddMemberDto,
  ): Promise<MemberResponseDto> {
    const member = await this.memberAppService.addMember(
      orgId,
      dto.userId,
      dto.role,
      dto.type,
    );
    return MemberResponseDto.fromAggregate(member);
  }

  @Get()
  @ApiOperation({ summary: 'List all members of an organization' })
  @ApiResponse({
    status: 200,
    description: 'List of members.',
    type: [MemberResponseDto],
  })
  async listMembers(
    @Param('orgId') orgId: string,
  ): Promise<MemberResponseDto[]> {
    const members =
      await this.memberAppService.getMembersByOrganization(orgId);
    return members.map((m) => MemberResponseDto.fromAggregate(m));
  }

  @Get(':memberId')
  @ApiOperation({ summary: 'Get a specific member' })
  @ApiResponse({
    status: 200,
    description: 'Return the member.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async getMember(
    @Param('memberId') memberId: string,
  ): Promise<MemberResponseDto> {
    const member = await this.memberAppService.getMemberById(memberId);
    return MemberResponseDto.fromAggregate(member);
  }

  @Patch(':memberId')
  @OrgRoles('owner', 'admin')
  @ApiOperation({
    summary: 'Update a member role or type (owner/admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully updated.',
    type: MemberResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async updateMember(
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberDto,
    @CurrentUser() user: unknown,
  ): Promise<MemberResponseDto> {
    const userId = extractUserId(user);
    const member = await this.memberAppService.updateMember(
      memberId,
      userId,
      dto.role,
      dto.type,
    );
    return MemberResponseDto.fromAggregate(member);
  }

  @Delete(':memberId')
  @OrgRoles('owner', 'admin')
  @ApiOperation({
    summary: 'Remove a member from an organization (owner/admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully removed.',
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async removeMember(@Param('memberId') memberId: string): Promise<void> {
    await this.memberAppService.removeMember(memberId);
  }
}
