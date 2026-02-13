import 'multer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrgMemberTypes } from '../../common/decorators/org-member-types.decorator';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { SessionGuard } from '../../common/guards/session.guard';
import { extractUserId } from '../../common/utils/extract-user-id';
import { MemberType } from '../member/domain/member.entity';
import { SongApplicationService } from './application';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongResponseDto } from './dto/song-response.dto';

@ApiTags('songs')
@Controller('organizations/:orgId/songs')
@UseGuards(SessionGuard, OrgMemberGuard)
export class SongController {
  constructor(
    private readonly songAppService: SongApplicationService,
  ) {}

  @Post()
  @OrgMemberTypes(MemberType.SONGWRITER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a new song (songwriter only)',
  })
  @ApiResponse({
    status: 201,
    description: 'The song has been successfully uploaded.',
    type: SongResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  async createSong(
    @Param('orgId') orgId: string,
    @Body() dto: CreateSongDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: unknown,
  ): Promise<SongResponseDto> {
    const userId = extractUserId(user);

    const filePath = `uploads/org/${orgId}/songs/${file.originalname}`;

    const song = await this.songAppService.createSong(
      orgId,
      userId,
      dto.title,
      filePath,
      file.originalname,
      file.mimetype,
      BigInt(file.size),
      dto.artist,
      dto.durationSec,
    );
    return SongResponseDto.fromAggregate(song);
  }

  @Get('my')
  @OrgMemberTypes(MemberType.SONGWRITER)
  @ApiOperation({ summary: 'List my uploaded songs (songwriter only)' })
  @ApiResponse({
    status: 200,
    description: 'List of songs uploaded by the current user.',
    type: [SongResponseDto],
  })
  async listMySongs(
    @Param('orgId') orgId: string,
    @CurrentUser() user: unknown,
  ): Promise<SongResponseDto[]> {
    const userId = extractUserId(user);
    const songs = await this.songAppService.getSongsByUploader(userId, orgId);
    return songs.map((s) => SongResponseDto.fromAggregate(s));
  }

  @Patch(':songId')
  @OrgMemberTypes(MemberType.SONGWRITER)
  @ApiOperation({ summary: 'Update own song metadata (songwriter only)' })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully updated.',
    type: SongResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Not the owner of this song.' })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  async updateSong(
    @Param('orgId') orgId: string,
    @Param('songId') songId: string,
    @Body() dto: UpdateSongDto,
    @CurrentUser() user: unknown,
  ): Promise<SongResponseDto> {
    const userId = extractUserId(user);
    const song = await this.songAppService.updateOwnSong(
      songId,
      orgId,
      userId,
      dto.title,
      dto.artist,
      dto.durationSec,
    );
    return SongResponseDto.fromAggregate(song);
  }

  @Delete(':songId')
  @OrgMemberTypes(MemberType.SONGWRITER)
  @ApiOperation({ summary: 'Delete own song (songwriter only)' })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Not the owner of this song.' })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  async deleteSong(
    @Param('orgId') orgId: string,
    @Param('songId') songId: string,
    @CurrentUser() user: unknown,
  ): Promise<void> {
    const userId = extractUserId(user);
    await this.songAppService.deleteOwnSong(songId, orgId, userId);
  }

  @Get()
  @OrgMemberTypes(MemberType.MANAGER)
  @ApiOperation({ summary: 'List all songs in the organization (manager only)' })
  @ApiResponse({
    status: 200,
    description: 'List of songs.',
    type: [SongResponseDto],
  })
  async listSongs(
    @Param('orgId') orgId: string,
  ): Promise<SongResponseDto[]> {
    const songs = await this.songAppService.getSongsByOrganization(orgId);
    return songs.map((s) => SongResponseDto.fromAggregate(s));
  }

  @Get(':songId')
  @OrgMemberTypes(MemberType.MANAGER)
  @ApiOperation({ summary: 'Get a specific song (manager only)' })
  @ApiResponse({
    status: 200,
    description: 'Return the song.',
    type: SongResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  async getSong(
    @Param('orgId') orgId: string,
    @Param('songId') songId: string,
  ): Promise<SongResponseDto> {
    const song = await this.songAppService.getSongById(songId, orgId);
    return SongResponseDto.fromAggregate(song);
  }
}
