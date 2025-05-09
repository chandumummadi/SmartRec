# events/recommendationsystem.py
import json, logging
import faiss
import numpy as np
from .models import Event, EventUserPreferences
from django.http import Http404

logger = logging.getLogger(__name__)
FAISS_INDEX_PATH = 'events_faiss.index'

def get_event_id_to_index_mapping():
    try:
        with open('event_id_to_index_mapping.json') as f:
            return json.load(f)
    except:
        return {}

def generate_user_embedding(weights, dim):
    cats = ['theatre', 'rock', 'performance_art', 'rnb', 'baseball', 'equestrian', 'football']
    emb = np.array([weights[c] for c in cats], dtype='float32')
    if len(emb) < dim:
        emb = np.pad(emb, (0, dim - len(emb)))
    emb = np.expand_dims(emb, axis=0)
    faiss.normalize_L2(emb)
    return emb

def get_recommended_events(user_id, top_n=5):
    try:
        pref = EventUserPreferences.objects.get(user_id=user_id)
        weights = {
            'theatre': pref.theatre_weight,
            'rock': pref.rock_weight,
            'performance_art': pref.performance_art_weight,
            'rnb': pref.rnb_weight,
            'baseball': pref.baseball_weight,
            'equestrian':pref.equestrian_weight,
            'football': pref.football_weight,
        }
        index = faiss.read_index(FAISS_INDEX_PATH)
        emb = generate_user_embedding(weights, index.d)
        distances, indices = index.search(emb, top_n)
        id_map = get_event_id_to_index_mapping()
        results = []
        for idx in indices[0]:
            event_id = id_map.get(str(idx))
            if event_id:
                try:
                    e = Event.objects.get(event_id=event_id)
                    results.append({
                        'event_id': e.event_id,
                        'title': e.title,
                        'category': e.category,
                        'description': e.description,
                        'url': e.url,
                        'image_url': e.image_url,
                        'location': e.location,
                        'date': e.date
                    })
                except Event.DoesNotExist:
                    continue
        return results
    except EventUserPreferences.DoesNotExist:
        raise Http404("User preferences not found")
