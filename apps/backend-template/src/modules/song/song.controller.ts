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
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { SessionGuard } from '../../common/guards/session.guard';
import { extractUserId } from '../../common/utils/extract-user-id';
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a new song to the organization',
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

    // Build the relative file path for storage
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

  @Get()
  @ApiOperation({ summary: 'List all songs in the organization' })
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
  @ApiOperation({ summary: 'Get a specific song' })
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

  @Patch(':songId')
  @ApiOperation({ summary: 'Update song metadata' })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully updated.',
    type: SongResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  async updateSong(
    @Param('orgId') orgId: string,
    @Param('songId') songId: string,
    @Body() dto: UpdateSongDto,
  ): Promise<SongResponseDto> {
    const song = await this.songAppService.updateSong(
      songId,
      orgId,
      dto.title,
      dto.artist,
      dto.durationSec,
    );
    return SongResponseDto.fromAggregate(song);
  }

  @Delete(':songId')
  @ApiOperation({ summary: 'Delete a song from the organization' })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  async deleteSong(
    @Param('orgId') orgId: string,
    @Param('songId') songId: string,
  ): Promise<void> {
    await this.songAppService.deleteSong(songId, orgId);
  }
}
