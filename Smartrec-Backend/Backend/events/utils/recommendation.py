import pickle
from sentence_transformers import SentenceTransformer
import numpy as np

reg = pickle.load(open("hybrid_regressor.pkl", "rb"))
defaults = pickle.load(open("defaults.pkl", "rb"))
model = SentenceTransformer('all-MiniLM-L6-v2')
DEFAULT_KEYS = ['global', 'pop', 'city', 'city_pop']

def generate_embeddings(events):
    core_texts = [e['combined_core'] for e in events]
    optional_texts = [e['combined_optional'] for e in events]
    core_emb = model.encode(core_texts)
    opt_emb = model.encode(optional_texts)
    return 0.8 * core_emb + 0.2 * opt_emb

def get_event_score_matrix(embeddings):
    return reg.predict(embeddings)

def get_top_events(events, embeddings, city, top_n=10):
    V_cand = get_event_score_matrix(embeddings)
    recs = []
    for key in DEFAULT_KEYS:
        if key in ['global', 'pop']:
            u = defaults[key]
        else:
            u = defaults.get(key, {}).get(city.lower(), defaults['global'])
        scores = V_cand @ u
        top_idx = np.argsort(scores)[::-1][:top_n]
        for i in top_idx:
            event = events[i].copy()
            event['score'] = float(scores[i])
            event['defaultKey'] = key
            recs.append(event)
    return sorted(recs, key=lambda x: x['score'], reverse=True)[:top_n]
