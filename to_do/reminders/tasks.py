from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from Home.models import Reminder
from Home.utils import notify_user

@shared_task
def check_and_send_reminders():
    now = timezone.now()
    due_reminders = Reminder.objects.filter(datetime__lte=now, is_active=True)
    for reminder in due_reminders:
        user_id = reminder.task.user.id
        notify_user(user_id, f"⏰ Reminder: {reminder.task.title} is due now!")

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
