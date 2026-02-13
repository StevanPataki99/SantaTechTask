import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import {
  MemberRole,
  MemberType,
} from '../../modules/member/domain/member.entity';
import { ORG_ROLES_KEY } from '../decorators/org-roles.decorator';
import { ORG_MEMBER_TYPES_KEY } from '../decorators/org-member-types.decorator';

/**
 * Guard that enforces organization-level authorization.
 *
 * Must run AFTER SessionGuard (which populates request.user & request.session).
 *
 * Checks:
 * 1. Session's activeOrganizationId matches the :orgId (or :id) route param.
 * 2. The authenticated user is a member of that organization.
 * 3. (Optional) The member's role matches the roles specified by @OrgRoles().
 * 4. (Optional) The member's type matches the types specified by @OrgMemberTypes().
 *
 * On success, attaches the member record to `request.member`.
 */
@Injectable()
export class OrgMemberGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const session = request.session;

    if (!user || !session) {
      throw new ForbiddenException('Authentication required');
    }

    // Resolve org ID from route params — controllers use :orgId or :id
    const orgId: string | undefined =
      request.params.orgId ?? request.params.id;

    if (!orgId) {
      throw new ForbiddenException('Organization context is required');
    }

    // Verify the session's active organization matches the target org
    if (session.activeOrganizationId !== orgId) {
      throw new ForbiddenException(
        'Organization mismatch: switch your active organization first',
      );
    }

    // Look up membership
    const member = await this.prisma.member.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: orgId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException(
        'You are not a member of this organization',
      );
    }

    // Check required roles if @OrgRoles() decorator is present
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(
      ORG_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(member.role as MemberRole)) {
        throw new ForbiddenException(
          `Requires one of roles: ${requiredRoles.join(', ')}`,
        );
      }
    }

    // Check required member types if @OrgMemberTypes() decorator is present
    const requiredTypes = this.reflector.getAllAndOverride<MemberType[]>(
      ORG_MEMBER_TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredTypes && requiredTypes.length > 0) {
      if (!requiredTypes.includes(member.type as MemberType)) {
        throw new ForbiddenException(
          `Requires one of member types: ${requiredTypes.join(', ')}`,
        );
      }
    }

    // Attach member to request for downstream use via @CurrentMember()
    request.member = member;
    return true;
  }
}
