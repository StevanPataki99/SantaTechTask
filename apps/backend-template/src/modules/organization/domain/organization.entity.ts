import { randomUUID } from 'crypto';

export class Organization {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _slug: string,
    private _logo: string | null,
    private _metadata: string | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(
    name: string,
    slug: string,
    logo?: string,
    metadata?: string,
  ): Organization {
    const now = new Date();
    return new Organization(
      randomUUID(),
      name,
      slug,
      logo ?? null,
      metadata ?? null,
      now,
      now,
    );
  }

  static reconstitute(
    id: string,
    name: string,
    slug: string,
    logo: string | null,
    metadata: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): Organization {
    return new Organization(
      id,
      name,
      slug,
      logo,
      metadata,
      createdAt,
      updatedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get logo(): string | null {
    return this._logo;
  }

  get metadata(): string | null {
    return this._metadata;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }
    this._name = newName;
    this._updatedAt = new Date();
  }

  updateSlug(newSlug: string): void {
    if (!newSlug || newSlug.trim().length === 0) {
      throw new Error('Slug cannot be empty');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newSlug)) {
      throw new Error(
        'Slug must be URL-friendly (lowercase alphanumeric with hyphens)',
      );
    }
    this._slug = newSlug;
    this._updatedAt = new Date();
  }

  updateLogo(logoUrl: string | null): void {
    this._logo = logoUrl;
    this._updatedAt = new Date();
  }

  updateMetadata(metadata: string | null): void {
    this._metadata = metadata;
    this._updatedAt = new Date();
  }
}
