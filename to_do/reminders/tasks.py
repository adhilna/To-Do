import logging
from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone
from datetime import timedelta
from Home.models import Reminder
from Home.utils import notify_user

logger = get_task_logger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def check_and_send_reminders(self):
    now = timezone.now()
    logger.info(f"🕒 Running reminders check at {now.isoformat()}")

    # Safety window to avoid missing reminders due to slight timing offset
    window_start = now - timedelta(minutes=1)
    window_end = now + timedelta(seconds=15)

    try:
        due_reminders = Reminder.objects.filter(
            datetime__gte=window_start,
            datetime__lte=window_end,
            is_active=True,
            notified=False
        ).select_related('task', 'task__user')

        if not due_reminders.exists():
            logger.info("🔎 No reminders due in this window.")
            return

        for reminder in due_reminders:
            user = reminder.task.user
            try:
                # Send via WebSocket group user_{user.id}
                notify_user(user.id, f"⏰ Reminder: {reminder.task.title} is due now!")
                logger.warning(f"🔔 Sent WebSocket notification to user_{user.id}")

                # Update reminder status after successful send
                if reminder.type == "daily":
                    reminder.datetime += timedelta(days=1)
                    reminder.notified = False
                elif reminder.type == "weekly":
                    reminder.datetime += timedelta(weeks=1)
                    reminder.notified = False
                else:  # once
                    reminder.is_active = False
                    reminder.notified = True

                reminder.save()
                logger.info(f"✅ Reminder {reminder.id} updated for user {user.id}")

            except Exception as notify_exc:
                logger.error(
                    f"❌ Failed to notify user {user.id} for reminder {reminder.id}: {notify_exc}",
                    exc_info=True
                )
                # Retry this task later if sending fails

    except Exception as exc:
        logger.error("❌ Unexpected error in reminder check", exc_info=True)
        raise self.retry(exc=exc)
