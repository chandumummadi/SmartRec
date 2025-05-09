# events/models.py
from django.db import models

class Event(models.Model):
    event_id = models.CharField(max_length=256, unique=True)
    title = models.TextField()
    category = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    url = models.TextField()
    image_url = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=100)
    date = models.DateTimeField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class EventUserPreferences(models.Model):
    user_id = models.CharField(max_length=255)
    theatre_weight = models.FloatField(default=0.0)
    rock_weight = models.FloatField(default=0.0)
    performance_art_weight = models.FloatField(default=0.0)
    rnb_weight = models.FloatField(default=0.0)
    baseball_weight = models.FloatField(default=0.0)
    equestrian_weight = models.FloatField(default=0.0)
    football_weight = models.FloatField(default=0.0)

    def __str__(self):
        return f"User {self.user_id} Event Preferences"

class EventUserInteractions(models.Model):
    user_id = models.CharField(max_length=255)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    clicked = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)