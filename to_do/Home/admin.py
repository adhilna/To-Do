from django.contrib import admin
from .models import TodoTask, Reminder

admin.site.register(TodoTask)

admin.site.register(Reminder)

