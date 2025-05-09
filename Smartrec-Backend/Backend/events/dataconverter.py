# events/dataconverter.py
import re, os, json, faiss, hashlib
import numpy as np
import pandas as pd
from .models import Event
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)
FAISS_INDEX_PATH = 'events_faiss.index'

model = SentenceTransformer('all-MiniLM-L6-v2')

def clean_text(text):
    if pd.isna(text): return ""
    text = text.lower().strip()
    return re.sub(r"[^a-zA-Z0-9 ]", "", text)

def generate_event_id(event):
    base = f"{event['title']} {event['description']} {event['url']} {event['date']}"
    return hashlib.sha256(base.encode()).hexdigest()

def generate_embeddings(events):
    embeddings = []
    id_to_index = {}
    for idx, event in enumerate(events):
        combined = clean_text(event['title']) + " " + clean_text(event['description'])
        emb = model.encode(combined)
        embeddings.append(emb)
        id_to_index[idx] = event['event_id']
    with open('event_id_to_index_mapping.json', 'w') as f:
        json.dump(id_to_index, f)
    return embeddings, id_to_index

def store_embeddings(embeddings):
    if os.path.exists(FAISS_INDEX_PATH):
        return faiss.read_index(FAISS_INDEX_PATH)
    index = faiss.IndexFlatL2(len(embeddings[0]))
    index.add(np.array(embeddings).astype('float32'))
    faiss.write_index(index, FAISS_INDEX_PATH)
    return index

def process_and_store_embeddings():
    events = Event.objects.all()
    data = [{
        'title': e.title, 'description': e.description, 'url': e.url,
        'date': e.date, 'event_id': e.event_id
    } for e in events]
    embeddings, _ = generate_embeddings(data)
    return store_embeddings(embeddings)
