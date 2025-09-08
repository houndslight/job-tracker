from django.db import models
from django.contrib.auth.models import User

class Application(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('screening', 'Phone/Video Screening'),
        ('interview', 'Interview'),
        ('technical', 'Technical Assessment'),
        ('final', 'Final Round'),
        ('offer', 'Offer Received'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    company = models.CharField(max_length=200)
    job_title = models.CharField(max_length=200)
    job_url = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    applied_date = models.DateField()
    last_updated = models.DateField(auto_now=True)
    notes = models.TextField(blank=True)
    contact_person = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    
    class Meta:
        ordering = ['-applied_date']
        
    def __str__(self):
        return f"{self.job_title} at {self.company}"