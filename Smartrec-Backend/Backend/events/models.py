from django.db import models
from django.conf import settings

class UserEventInteraction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    genre = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)