from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated  # Remove AllowAny
from django.db.models import Q
from .models import JobApplication
from .serializers import JobApplicationSerializer

class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]  # Change back to IsAuthenticated
    
    def get_queryset(self):
        queryset = JobApplication.objects.filter(user=self.request.user)  # Filter by user again
        
        # Add search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(company__icontains=search) | 
                Q(role__icontains=search) |
                Q(location__icontains=search)
            )
        
        # Add status filtering
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Save with current user
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        stats = {
            'total': queryset.count(),
            'applied': queryset.filter(status='applied').count(),
            'screening': queryset.filter(status='screening').count(),
            'interview': queryset.filter(status='interview').count(),
            'offer': queryset.filter(status='offer').count(),
            'rejected': queryset.filter(status='rejected').count(),
            'withdrawn': queryset.filter(status='withdrawn').count(),
        }
        return Response(stats)