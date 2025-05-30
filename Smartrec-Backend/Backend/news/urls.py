from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.get_categories_articles, name='categories_articles'), #5
    path('populate/', views.populate_news_data, name='populate_news_data'), #1
    path('recommend_news/', views.recommend_news, name='recommend_news'),
    path('update_user_preferences/', views.update_user_preferences, name='update_user_preferences'), #2
    path('user_preferences/', views.get_user_preferences_view, name = 'get_user_preferences'), #3
    path('trending/', views.get_trending_news, name = 'get_trending_news'), #4
    path('handle_click/', views.handle_click_view, name = 'handle_user_click')
]