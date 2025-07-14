from django.db import models
from django.contrib.auth.models import User  

class TodoTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True) 
    title = models.CharField(max_length=128)
    description = models.TextField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Reminder(models.Model):
    REMINDER_TYPE_CHOICES = [
        ('once', 'Once'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
    ]
    task = models.ForeignKey(TodoTask, on_delete=models.CASCADE, related_name='reminders')
    datetime = models.DateTimeField()  # Stores both date and time
    type = models.CharField(max_length=10, choices=REMINDER_TYPE_CHOICES, default='once')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    notified = models.BooleanField(default=False)  # Optional: track if notification sent

    def __str__(self):
        return f"Reminder for '{self.task.title}' at {self.datetime} ({self.type})"