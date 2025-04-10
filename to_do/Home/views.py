from rest_framework import viewsets
from .models import TodoTask
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = TodoTask.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

    


