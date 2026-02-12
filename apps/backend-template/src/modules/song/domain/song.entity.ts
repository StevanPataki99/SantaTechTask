import { randomUUID } from 'crypto';

export class Song {
  private constructor(
    private readonly _id: string,
    private readonly _organizationId: string,
    private readonly _uploaderId: string,
    private _title: string,
    private _artist: string | null,
    private _durationSec: number | null,
    private readonly _filePath: string,
    private readonly _fileName: string,
    private readonly _mimeType: string,
    private readonly _sizeBytes: bigint,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(
    organizationId: string,
    uploaderId: string,
    title: string,
    filePath: string,
    fileName: string,
    mimeType: string,
    sizeBytes: bigint,
    artist?: string | null,
    durationSec?: number | null,
  ): Song {
    if (!title || title.trim().length === 0) {
      throw new Error('Song title is required');
    }
    if (!filePath || filePath.trim().length === 0) {
      throw new Error('Song file path is required');
    }
    const now = new Date();
    return new Song(
      randomUUID(),
      organizationId,
      uploaderId,
      title.trim(),
      artist?.trim() ?? null,
      durationSec ?? null,
      filePath,
      fileName,
      mimeType,
      sizeBytes,
      now,
      now,
    );
  }

  static reconstitute(
    id: string,
    organizationId: string,
    uploaderId: string,
    title: string,
    artist: string | null,
    durationSec: number | null,
    filePath: string,
    fileName: string,
    mimeType: string,
    sizeBytes: bigint,
    createdAt: Date,
    updatedAt: Date,
  ): Song {
    return new Song(
      id,
      organizationId,
      uploaderId,
      title,
      artist,
      durationSec,
      filePath,
      fileName,
      mimeType,
      sizeBytes,
      createdAt,
      updatedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get uploaderId(): string {
    return this._uploaderId;
  }

  get title(): string {
    return this._title;
  }

  get artist(): string | null {
    return this._artist;
  }

  get durationSec(): number | null {
    return this._durationSec;
  }

  get filePath(): string {
    return this._filePath;
  }

  get fileName(): string {
    return this._fileName;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get sizeBytes(): bigint {
    return this._sizeBytes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateMetadata(title?: string, artist?: string | null, durationSec?: number | null): void {
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        throw new Error('Song title cannot be empty');
      }
      this._title = title.trim();
    }
    if (artist !== undefined) {
      this._artist = artist?.trim() ?? null;
    }
    if (durationSec !== undefined) {
      this._durationSec = durationSec;
    }
    this._updatedAt = new Date();
  }
}
