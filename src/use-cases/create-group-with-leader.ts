import { createGroup, type GroupInput } from '@/services/groupService';
import { assignRoleToUserInGroup } from '@/services/userService';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

export async function createGroupWithLeader(data: GroupInput, leaderId: string): Promise<string> {
  try {
    const groupId = await createGroup(data);
    await assignRoleToUserInGroup(groupId, leaderId, 'leader');
    return groupId;
  } catch (err) {
    Sentry.captureException(err);
    logger.error({ action: 'create_group_with_leader_error', meta: { error: err } });
    throw err;
  }
}
