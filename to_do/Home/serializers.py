from rest_framework import serializers
from .models import TodoTask

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoTask
        fields = '__all__'
        read_only_fields = ['user']
