import { randomUUID } from 'crypto';

export class Tag {
  private constructor(
    private readonly _id: string,
    private readonly _organizationId: string,
    private _name: string,
  ) {}

  static create(organizationId: string, name: string): Tag {
    if (!name || name.trim().length === 0) {
      throw new Error('Tag name is required');
    }
    return new Tag(randomUUID(), organizationId, name.trim().toLowerCase());
  }

  static reconstitute(
    id: string,
    organizationId: string,
    name: string,
  ): Tag {
    return new Tag(id, organizationId, name);
  }

  get id(): string {
    return this._id;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get name(): string {
    return this._name;
  }

  rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Tag name cannot be empty');
    }
    this._name = newName.trim().toLowerCase();
  }
}
