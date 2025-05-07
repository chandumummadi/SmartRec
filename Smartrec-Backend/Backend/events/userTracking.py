from .models import UserEventInteraction

def record_genre_click(user, genre):
    UserEventInteraction.objects.create(user=user, genre=genre)