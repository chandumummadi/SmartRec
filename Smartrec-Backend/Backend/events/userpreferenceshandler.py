# events/userpreferenceshandler.py
from .models import EventUserPreferences
from django.http import Http404
import logging

logger = logging.getLogger(__name__)

def get_user_preferences(user_id):
    try:
        user_pref = EventUserPreferences.objects.get(user_id=user_id)
        return {
            'theatre': user_pref.theatre_weight,
            'rock': user_pref.rock_weight,
            'performance_art': user_pref.performance_art_weight,
            'rnb': user_pref.rnb_weight,
            'baseball': user_pref.baseball_weight,
            'equestrian': user_pref.equestrian_weight,
            'football': user_pref.football_weight,

        }
    except EventUserPreferences.DoesNotExist:
        logger.error(f"Event preferences not found for user {user_id}.")
        raise Http404({"error": "User preferences not found. Please select your preferences."})

def update_user_preferences_impl(user_id, categories):
    try:
        available_categories = ['theatre', 'rock', 'performance_art', 'rnb', 'baseball', 'equestrian', 'football']
        valid_categories = [cat for cat in categories if cat in available_categories]
        if not valid_categories:
            raise Exception("No valid categories provided.")

        weight = 1 / len(valid_categories)
        weights = {cat: weight for cat in valid_categories}

        user_pref, _ = EventUserPreferences.objects.get_or_create(user_id=user_id)

        for category in available_categories:
            setattr(user_pref, f"{category}_weight", weights.get(category, 0))

        user_pref.save()
        logger.info(f"Event preferences updated for user {user_id}.")
        return {"message": "Preferences updated successfully."}
    except Exception as e:
        logger.error(f"Error updating preferences for user {user_id}: {str(e)}")
        return {"error": str(e)}
