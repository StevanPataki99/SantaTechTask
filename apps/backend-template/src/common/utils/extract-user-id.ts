import { UnauthorizedException } from '@nestjs/common';

export function extractUserId(user: unknown): string {
  if (
    !user ||
    typeof user !== 'object' ||
    !('id' in user) ||
    typeof (user as { id: unknown }).id !== 'string'
  ) {
    throw new UnauthorizedException('Invalid user context');
  }
  return (user as { id: string }).id;
}
