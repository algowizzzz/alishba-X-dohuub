// Push-notification helper.
//
// Sends Expo push notifications to a list of users. For each user we:
//   1) look up their PushToken rows (a user can have multiple — multiple devices)
//   2) filter for valid Expo push tokens via Expo.isExpoPushToken
//   3) chunk + send via expo.sendPushNotificationsAsync
//   4) mirror the message into the Notification table so it shows up in the
//      in-app notifications list even if the device push fails.
//
// We deliberately swallow per-receipt errors so a flaky token can't fail
// the caller (e.g. a booking-status update should still succeed even if the
// push delivery fails).
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { prisma } from '@doohub/database';

const expo = new Expo();

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload,
): Promise<void> {
  if (!userIds || userIds.length === 0) return;

  // Always create in-app Notification rows so users see history even if the
  // device push fails or the user has no registered token.
  try {
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        title: payload.title,
        body: payload.body,
        type: (payload.data?.type as string) || 'PUSH',
        data: payload.data || {},
        isRead: false,
      })),
    });
  } catch (e) {
    console.error('[push] Failed to insert in-app notifications:', e);
  }

  let tokens: { token: string; userId: string }[] = [];
  try {
    const rows = await prisma.pushToken.findMany({
      where: { userId: { in: userIds } },
      select: { token: true, userId: true },
    });
    tokens = rows;
  } catch (e) {
    console.error('[push] Failed to look up push tokens:', e);
    return;
  }

  if (tokens.length === 0) {
    console.log(`[push] No push tokens registered for ${userIds.length} user(s).`);
    return;
  }

  const messages: ExpoPushMessage[] = [];
  for (const { token } of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.warn(`[push] Skipping invalid Expo push token: ${token}`);
      continue;
    }
    messages.push({
      to: token,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
    });
  }

  if (messages.length === 0) {
    console.log('[push] No valid Expo tokens after filtering.');
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);
  let okCount = 0;
  let errCount = 0;

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      for (const ticket of tickets) {
        if (ticket.status === 'ok') okCount++;
        else errCount++;
      }
    } catch (e) {
      console.error('[push] Failed to send chunk:', e);
      errCount += chunk.length;
    }
  }

  console.log(`[push] Sent: ${okCount} ok, ${errCount} errors, target users: ${userIds.length}`);
}
