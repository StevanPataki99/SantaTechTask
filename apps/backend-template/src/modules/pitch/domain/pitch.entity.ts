import { randomUUID } from 'crypto';

export class TargetArtist {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
  ) {}

  static create(name: string): TargetArtist {
    if (!name || name.trim().length === 0) {
      throw new Error('Target artist name is required');
    }
    return new TargetArtist(randomUUID(), name.trim());
  }

  static reconstitute(id: string, name: string): TargetArtist {
    return new TargetArtist(id, name);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}

export class PitchTag {
  private constructor(
    private readonly _tagId: string,
    private readonly _name: string,
  ) {}

  static create(tagId: string, name: string): PitchTag {
    return new PitchTag(tagId, name);
  }

  get tagId(): string {
    return this._tagId;
  }

  get name(): string {
    return this._name;
  }
}

export class Pitch {
  private constructor(
    private readonly _id: string,
    private readonly _organizationId: string,
    private readonly _songId: string,
    private readonly _createdById: string,
    private _description: string | null,
    private _tags: PitchTag[],
    private _targetArtists: TargetArtist[],
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(
    organizationId: string,
    songId: string,
    createdById: string,
    description?: string | null,
    tags?: PitchTag[],
    targetArtists?: TargetArtist[],
  ): Pitch {
    if (!songId || songId.trim().length === 0) {
      throw new Error('Song ID is required for a pitch');
    }
    const now = new Date();
    return new Pitch(
      randomUUID(),
      organizationId,
      songId,
      createdById,
      description?.trim() ?? null,
      tags ?? [],
      targetArtists ?? [],
      now,
      now,
    );
  }

  static reconstitute(
    id: string,
    organizationId: string,
    songId: string,
    createdById: string,
    description: string | null,
    tags: PitchTag[],
    targetArtists: TargetArtist[],
    createdAt: Date,
    updatedAt: Date,
  ): Pitch {
    return new Pitch(
      id,
      organizationId,
      songId,
      createdById,
      description,
      tags,
      targetArtists,
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

  get songId(): string {
    return this._songId;
  }

  get createdById(): string {
    return this._createdById;
  }

  get description(): string | null {
    return this._description;
  }

  get tags(): ReadonlyArray<PitchTag> {
    return this._tags;
  }

  get targetArtists(): ReadonlyArray<TargetArtist> {
    return this._targetArtists;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateDescription(description: string | null): void {
    this._description = description?.trim() ?? null;
    this._updatedAt = new Date();
  }

  replaceTags(tags: PitchTag[]): void {
    this._tags = tags;
    this._updatedAt = new Date();
  }

  replaceTargetArtists(targetArtists: TargetArtist[]): void {
    // Check for duplicate names
    const names = new Set<string>();
    for (const artist of targetArtists) {
      const lower = artist.name.toLowerCase();
      if (names.has(lower)) {
        throw new Error(`Duplicate target artist: ${artist.name}`);
      }
      names.add(lower);
    }
    this._targetArtists = targetArtists;
    this._updatedAt = new Date();
  }
}
