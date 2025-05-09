# events/decayfunction.py
from .models import EventUserPreferences, Event, EventUserInteractions
import logging
from django.http import Http404


logger = logging.getLogger(__name__)

def update_user_preferences(user_id, category, click_weight, decay_rate=0.02):
    try:
        user_pref, _ = EventUserPreferences.objects.get_or_create(user_id=user_id)
        current_weight = getattr(user_pref, f"{category}_weight", 0)
        new_weight = current_weight + (click_weight - current_weight) * decay_rate
        setattr(user_pref, f"{category}_weight", new_weight)
        decay_other_categories(user_pref, category, decay_rate)
        normalize_and_save_preferences(user_pref)
        logger.info(f"Updated user {user_id} preference for {category} to {new_weight}")
    except Exception as e:
        logger.error(f"Error updating user preferences: {str(e)}")

def decay_other_categories(user_pref, clicked_category, decay_rate):
    categories = ['theatre', 'rock', 'performance_art', 'rnb', 'baseball', 'equestrian', 'football']
    for category in categories:
        if category != clicked_category:
            weight = getattr(user_pref, f"{category}_weight", 0.0)
            setattr(user_pref, f"{category}_weight", weight * (1 - decay_rate))

def normalize_and_save_preferences(user_pref):
    categories = ['theatre', 'rock', 'performance_art', 'rnb', 'baseball']
    total = sum([getattr(user_pref, f"{cat}_weight", 0.0) for cat in categories])
    if total == 0:
        logger.warning(f"Total weight zero for user {user_pref.user_id}")
        return
    for category in categories:
        current = getattr(user_pref, f"{category}_weight", 0.0)
        setattr(user_pref, f"{category}_weight", current / total)
    user_pref.save()

def handle_user_click(user_id, event_id):
    try:
        event = Event.objects.get(event_id=event_id)
        update_user_preferences(user_id, event.category, 1.0)
        EventUserInteractions.objects.create(user_id=user_id, event=event, clicked=True)
    except Event.DoesNotExist:
        raise Http404(f"Event with ID {event_id} not found.")