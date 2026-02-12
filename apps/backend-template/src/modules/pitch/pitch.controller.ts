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
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { SessionGuard } from '../../common/guards/session.guard';
import { extractUserId } from '../../common/utils/extract-user-id';
import { PitchApplicationService } from './application';
import { CreatePitchDto } from './dto/create-pitch.dto';
import { UpdatePitchDto } from './dto/update-pitch.dto';
import { PitchResponseDto } from './dto/pitch-response.dto';

@ApiTags('pitches')
@Controller('organizations/:orgId/pitches')
@UseGuards(SessionGuard, OrgMemberGuard)
export class PitchController {
  constructor(
    private readonly pitchAppService: PitchApplicationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new pitch for a song',
  })
  @ApiResponse({
    status: 201,
    description: 'The pitch has been successfully created.',
    type: PitchResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  async createPitch(
    @Param('orgId') orgId: string,
    @Body() dto: CreatePitchDto,
    @CurrentUser() user: unknown,
  ): Promise<PitchResponseDto> {
    const userId = extractUserId(user);
    const pitch = await this.pitchAppService.createPitch(
      orgId,
      userId,
      dto.songId,
      dto.description,
      dto.tags,
      dto.targetArtists,
    );
    return PitchResponseDto.fromAggregate(pitch);
  }

  @Get()
  @ApiOperation({ summary: 'List all pitches in the organization' })
  @ApiResponse({
    status: 200,
    description: 'List of pitches.',
    type: [PitchResponseDto],
  })
  async listPitches(
    @Param('orgId') orgId: string,
  ): Promise<PitchResponseDto[]> {
    const pitches =
      await this.pitchAppService.getPitchesByOrganization(orgId);
    return pitches.map((p) => PitchResponseDto.fromAggregate(p));
  }

  @Get(':pitchId')
  @ApiOperation({ summary: 'Get a specific pitch' })
  @ApiResponse({
    status: 200,
    description: 'Return the pitch.',
    type: PitchResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pitch not found.' })
  async getPitch(
    @Param('orgId') orgId: string,
    @Param('pitchId') pitchId: string,
  ): Promise<PitchResponseDto> {
    const pitch = await this.pitchAppService.getPitchById(pitchId, orgId);
    return PitchResponseDto.fromAggregate(pitch);
  }

  @Get('song/:songId')
  @ApiOperation({ summary: 'List all pitches for a specific song' })
  @ApiResponse({
    status: 200,
    description: 'List of pitches for the song.',
    type: [PitchResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  async getPitchesBySong(
    @Param('orgId') orgId: string,
    @Param('songId') songId: string,
  ): Promise<PitchResponseDto[]> {
    const pitches = await this.pitchAppService.getPitchesBySong(songId, orgId);
    return pitches.map((p) => PitchResponseDto.fromAggregate(p));
  }

  @Patch(':pitchId')
  @ApiOperation({ summary: 'Update a pitch (description, tags, target artists)' })
  @ApiResponse({
    status: 200,
    description: 'The pitch has been successfully updated.',
    type: PitchResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pitch not found.' })
  async updatePitch(
    @Param('orgId') orgId: string,
    @Param('pitchId') pitchId: string,
    @Body() dto: UpdatePitchDto,
  ): Promise<PitchResponseDto> {
    const pitch = await this.pitchAppService.updatePitch(
      pitchId,
      orgId,
      dto.description,
      dto.tags,
      dto.targetArtists,
    );
    return PitchResponseDto.fromAggregate(pitch);
  }

  @Delete(':pitchId')
  @ApiOperation({ summary: 'Delete a pitch' })
  @ApiResponse({
    status: 200,
    description: 'The pitch has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Pitch not found.' })
  async deletePitch(
    @Param('orgId') orgId: string,
    @Param('pitchId') pitchId: string,
  ): Promise<void> {
    await this.pitchAppService.deletePitch(pitchId, orgId);
  }
}
