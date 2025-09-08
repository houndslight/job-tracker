from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'company']
    search_fields = ['company', 'job_title', 'location']
    ordering_fields = ['applied_date', 'last_updated', 'company']
    ordering = ['-applied_date']
    
    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)