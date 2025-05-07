from django.urls import path
from . import views

urlpatterns = [
    path("cities/", views.get_cities),
    path("genres/", views.get_genres),
    path("recommendations/", views.get_recommendations),
    path("track_click/", views.track_click),
]

