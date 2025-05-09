# events/views.py
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .decayfunction import handle_user_click
from .recommendationsystem import get_recommended_events
from .dataconverter import process_and_store_embeddings
from .eventhandler import fetch_all_events_for_categories, save_events_to_db
from .userpreferenceshandler import update_user_preferences_impl, get_user_preferences
from .models import Event


logger = logging.getLogger(__name__)

@csrf_exempt
def get_trending_events(request):
    if request.method == "GET":
        try:
            top_n = int(request.GET.get("top_n", 10))
            trending_events = Event.objects.all().order_by('-date')[:top_n]
            events_data = [
                {
                    "event_id": e.event_id,
                    "title": e.title,
                    "category": e.category,
                    "description": e.description,
                    "url": e.url,
                    "image_url": e.image_url,
                    "location": e.location,
                    "date": e.date
                } for e in trending_events
            ]
            return JsonResponse({"trending_events": events_data}, status=200)
        except Exception as e:
            logger.error(str(e))
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_user_preferences(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = request.GET.get('user_id')
            categories = data.get("categories", None)
            if not categories:
                return JsonResponse({"error": "No categories provided."}, status=400)
            response = update_user_preferences_impl(user_id, categories)
            if "error" in response:
                return JsonResponse(response, status=400)
            return JsonResponse(response, status=200)
        except Exception as e:
            logger.error(str(e))
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_user_preferences_view(request):
    if request.method == "GET":
        try:
            user_id = request.GET.get("user_id")
            if not user_id:
                return JsonResponse({"error": "No user_id provided."}, status=400)
            user_weights = get_user_preferences(user_id)
            preferences_data = [
                {"category": category, "weight": weight}
                for category, weight in user_weights.items()
            ]
            return JsonResponse({"preferences": preferences_data}, status=200)
        except Http404 as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def recommend_events(request):
    if request.method == "GET":
        try:
            user_id = request.GET.get("user_id")
            if not user_id:
                return JsonResponse({"error": "User ID is required"}, status=400)

            recommended_events = get_recommended_events(user_id, 21)

            return JsonResponse({"recommended_events": recommended_events}, status=200)
        except Http404 as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    

@csrf_exempt
def handle_click_view(request):
    if request.method == "POST":
        try:
            user_id = request.GET.get("user_id")
            event_id = request.GET.get("event_id")
            handle_user_click(user_id, event_id)
            return JsonResponse({"message": "Preferences updated."})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_categories_events(request):
    if request.method == "GET":
        try:
            categories = request.GET.getlist("categories")
            if not categories:
                return JsonResponse({"error": "No categories provided"}, status=400)

            events_data = {}
            for category in categories:
                events = Event.objects.filter(category=category).values(
                    "event_id", "title", "category", "description", "url", "image_url", "location", "date"
                )
                events_data[category] = list(events)

            return JsonResponse({"events": events_data}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
@csrf_exempt
def populate_events_data(request):
    if request.method == "GET":
        try:
            categories = ['theatre', 'rock', 'performance_art', 'rnb', 'baseball', 'equestrian', 'football']
            events = fetch_all_events_for_categories(categories)
            save_events_to_db(events)
            process_and_store_embeddings()
            return JsonResponse({'message': 'Event data populated and indexed.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
