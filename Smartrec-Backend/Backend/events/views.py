from django.http import JsonResponse
from .utils.ticketmaster_api import fetch_events
from .utils.recommendation import generate_embeddings, get_top_events
from .userTracking import record_genre_click
from django.views.decorators.csrf import csrf_exempt

def get_cities(request):
    cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
              "Philadelphia", "San Antonio", "San Diego"]
    return JsonResponse({"cities": cities})

def get_genres(request):
    city = request.GET.get("city")
    start_date = request.GET.get("startDate")
    end_date = request.GET.get("endDate")
    raw_events = fetch_events(city, start_date, end_date)
    genres = list({e.get('classifications', [{}])[0].get('genre', {}).get('name', 'unknown').lower() for e in raw_events})
    return JsonResponse({"genres": genres})

def get_recommendations(request):
    city = request.GET.get("city")
    genre = request.GET.get("genre")
    start = request.GET.get("startDate")
    end = request.GET.get("endDate")
    top_n = int(request.GET.get("topN", 10))

    raw_events = fetch_events(city, start, end, genre, size=100)
    if not raw_events:
        return JsonResponse({"recommendations": []})

    simplified = []
    for e in raw_events:
        simplified.append({
            "eventId": e["id"],
            "eventName": e["name"],
            "eventGenre": genre,
            "eventDate": e["dates"]["start"].get("localDate"),
            "venueName": e["_embedded"]["venues"][0]["name"] if e.get("_embedded") else "Unknown",
            "imageUrl": e.get("images", [{}])[0].get("url", ""),
            "combined_core": e["name"],
            "combined_optional": e.get("info", ""),
        })

    embeddings = generate_embeddings(simplified)
    top_events = get_top_events(simplified, embeddings, city, top_n)

    return JsonResponse({"recommendations": top_events})

@csrf_exempt
def track_click(request):
    if request.method == "POST":
        user = request.user
        genre = request.POST.get("genre")
        if user and genre:
            record_genre_click(user, genre)
            return JsonResponse({"message": "Click recorded"})
        return JsonResponse({"error": "Invalid data"}, status=400)
