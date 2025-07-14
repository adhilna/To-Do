from rest_framework import serializers
from .models import TodoTask, Reminder

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoTask
        fields = '__all__'
        read_only_fields = ['user']

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'task', 'datetime', 'type', 'is_active', 'created_at', 'notified']