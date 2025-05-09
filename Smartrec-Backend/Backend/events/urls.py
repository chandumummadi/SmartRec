# events/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('trending/', views.get_trending_events, name='get_trending_events'),
    path('update_user_preferences/', views.update_user_preferences, name='update_user_preferences'),
    path('user_preferences/', views.get_user_preferences_view, name='get_user_preferences'),
    path('recommend_events/', views.recommend_events, name='recommend_events'),
    path('handle_click/', views.handle_click_view, name='handle_event_click'),
    path('categories/', views.get_categories_events, name='categories_events'),
    path('populate/', views.populate_events_data, name='populate_events_data'),
]