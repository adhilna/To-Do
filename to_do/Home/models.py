from django.db import models

class TodoTask(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    