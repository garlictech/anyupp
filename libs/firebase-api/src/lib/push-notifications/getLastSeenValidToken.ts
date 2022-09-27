import { User } from '@bgap/domain';
import { findLast, sortBy } from 'lodash';

export const getLastSeenValidToken = (
  user: User | null | undefined,
): string | null => {
  return user?.fcmTokens
    ? findLast(sortBy(user.fcmTokens, ['lastSeen']))?.token || null
    : null;
};
