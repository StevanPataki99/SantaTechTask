import { randomUUID } from 'crypto';

export enum MemberType {
  MANAGER = 'MANAGER',
  SONGWRITER = 'SONGWRITER',
}

export type MemberRole = 'owner' | 'admin' | 'member';

const VALID_ROLES: MemberRole[] = ['owner', 'admin', 'member'];

export class Member {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _organizationId: string,
    private _role: MemberRole,
    private _type: MemberType,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(
    userId: string,
    organizationId: string,
    role: MemberRole,
    type: MemberType,
  ): Member {
    if (!VALID_ROLES.includes(role)) {
      throw new Error(`Invalid member role: ${role}`);
    }
    const now = new Date();
    return new Member(
      randomUUID(),
      userId,
      organizationId,
      role,
      type,
      now,
      now,
    );
  }

  static reconstitute(
    id: string,
    userId: string,
    organizationId: string,
    role: MemberRole,
    type: MemberType,
    createdAt: Date,
    updatedAt: Date,
  ): Member {
    return new Member(
      id,
      userId,
      organizationId,
      role,
      type,
      createdAt,
      updatedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get role(): MemberRole {
    return this._role;
  }

  get type(): MemberType {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  changeRole(newRole: MemberRole): void {
    if (!VALID_ROLES.includes(newRole)) {
      throw new Error(`Invalid member role: ${newRole}`);
    }
    if (this._role === 'owner') {
      throw new Error(
        'Cannot change the role of an owner directly. Transfer ownership first.',
      );
    }
    this._role = newRole;
    this._updatedAt = new Date();
  }

  changeType(newType: MemberType): void {
    this._type = newType;
    this._updatedAt = new Date();
  }

  isOwner(): boolean {
    return this._role === 'owner';
  }

  isAdmin(): boolean {
    return this._role === 'admin';
  }

  isManager(): boolean {
    return this._type === MemberType.MANAGER;
  }

  isSongwriter(): boolean {
    return this._type === MemberType.SONGWRITER;
  }

  canManageMembers(): boolean {
    return this._role === 'owner' || this._role === 'admin';
  }
}
