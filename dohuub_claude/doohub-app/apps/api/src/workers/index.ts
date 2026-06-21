// Background workers — invoked once from server startup. Uses setInterval
// (in-process) instead of a separate worker dyno because the workload is
// tiny: a few dozen DB rows per tick, no fan-out, no queue.
import { prisma } from '@doohub/database';
import { sendPushToUsers } from '../utils/push';

const PUSH_TICK_MS = 60_000;        // every minute
const TRIAL_TICK_MS = 60 * 60_000;  // every hour

async function resolveTargetUserIds(targetType: string, targetIds: string[]): Promise<string[]> {
  if (targetType === 'SPECIFIC') return targetIds || [];
  const whereClause: any = { isActive: true };
  if (targetType === 'CUSTOMERS') whereClause.role = 'CUSTOMER';
  else if (targetType === 'VENDORS') whereClause.role = 'VENDOR';
  const users = await prisma.user.findMany({ where: whereClause, select: { id: true } });
  return users.map((u) => u.id);
}

export async function runScheduledPushTick() {
  try {
    const now = new Date();
    const due = await prisma.scheduledPushNotification.findMany({
      where: {
        status: 'SCHEDULED',
        OR: [
          { scheduledFor: { lte: now } },
          { scheduledFor: null },
        ],
      },
      take: 50,
    });

    for (const job of due) {
      try {
        const recipients = await resolveTargetUserIds(job.targetType, job.targetIds);
        if (recipients.length > 0) {
          await sendPushToUsers(recipients, {
            title: job.title,
            body: job.body,
            data: job.link ? { link: job.link } : {},
          });
        }
        await prisma.scheduledPushNotification.update({
          where: { id: job.id },
          data: { status: 'SENT', sentAt: new Date(), recipientCount: recipients.length },
        });
      } catch (err: any) {
        console.error(`[worker] Scheduled push ${job.id} failed:`, err);
        await prisma.scheduledPushNotification.update({
          where: { id: job.id },
          data: { status: 'FAILED', errorMessage: err?.message || 'unknown error' },
        });
      }
    }
  } catch (e) {
    console.error('[worker] scheduled-push tick error:', e);
  }
}

export async function runTrialExpirationTick() {
  try {
    const settings = await prisma.platformSettings.findFirst();
    if (!settings) return;

    const now = new Date();
    const reminderCutoff = new Date(now.getTime() + (settings.trialReminderDaysBefore || 3) * 24 * 60 * 60 * 1000);

    // 1) Trials ending within the reminder window — send a one-time reminder.
    if (settings.trialOnExpirySendNotification) {
      const upcoming = await prisma.vendor.findMany({
        where: {
          status: 'APPROVED',
          subscriptionStatus: 'TRIAL',
          trialEndsAt: { gte: now, lte: reminderCutoff },
        },
        select: { id: true, userId: true, businessName: true, trialEndsAt: true },
      });
      for (const v of upcoming) {
        await sendPushToUsers([v.userId], {
          title: 'Your DoHuub trial is ending soon',
          body: `Your trial for ${v.businessName} ends on ${v.trialEndsAt?.toDateString()}. Add a payment method to keep your listings live.`,
          data: { type: 'TRIAL_REMINDER', vendorId: v.id },
        });
      }
    }

    // 2) Trials that have already expired — apply the configured action.
    const graceMs = (settings.trialGracePeriodDays || 0) * 24 * 60 * 60 * 1000;
    const expiryCutoff = new Date(now.getTime() - graceMs);

    const expired = await prisma.vendor.findMany({
      where: {
        subscriptionStatus: 'TRIAL',
        trialEndsAt: { lt: expiryCutoff },
      },
      select: { id: true, userId: true, businessName: true },
    });

    for (const v of expired) {
      try {
        const updates: any[] = [];

        if (settings.trialOnExpiryDeactivateListings) {
          for (const model of ['cleaningListing', 'handymanListing', 'beautyListing', 'rentalListing', 'groceryListing', 'foodListing', 'beautyProductListing', 'rideAssistanceListing', 'companionshipListing'] as const) {
            updates.push((prisma as any)[model].updateMany({
              where: { vendorId: v.id, status: 'ACTIVE' },
              data: { status: 'PAUSED' },
            }));
          }
        }

        const newSubStatus: any = settings.trialOnExpirySuspendAccount ? 'CANCELLED' : 'EXPIRED';
        const vendorUpdate: any = { subscriptionStatus: newSubStatus };
        if (settings.trialOnExpirySuspendAccount) {
          vendorUpdate.status = 'SUSPENDED';
          vendorUpdate.isActive = false;
        }
        updates.push(prisma.vendor.update({ where: { id: v.id }, data: vendorUpdate }));

        await Promise.all(updates);

        if (settings.trialOnExpirySendNotification) {
          await sendPushToUsers([v.userId], {
            title: 'Your DoHuub trial has ended',
            body: `Your trial for ${v.businessName} has ended. ${settings.trialOnExpirySuspendAccount ? 'Your account has been suspended.' : 'Add a payment method to continue.'}`,
            data: { type: 'TRIAL_EXPIRED', vendorId: v.id },
          });
        }
      } catch (vErr) {
        console.error(`[worker] Trial-expire failed for vendor ${v.id}:`, vErr);
      }
    }
  } catch (e) {
    console.error('[worker] trial-expiration tick error:', e);
  }
}

export function startWorkers() {
  if (process.env.WORKERS_DISABLED === 'true') {
    console.log('[worker] WORKERS_DISABLED=true — skipping startup');
    return;
  }
  console.log('[worker] starting scheduled-push tick (60s) + trial-expiration tick (1h)');
  setInterval(runScheduledPushTick, PUSH_TICK_MS);
  setInterval(runTrialExpirationTick, TRIAL_TICK_MS);
  // Run once on boot so we don't wait a full interval for the first run.
  runScheduledPushTick().catch(() => {});
  runTrialExpirationTick().catch(() => {});
}
