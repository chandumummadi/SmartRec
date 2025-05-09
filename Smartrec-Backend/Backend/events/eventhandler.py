# events/eventhandler.py
import requests, hashlib, logging
from django.conf import settings
from .models import Event
from django.db import IntegrityError

logger = logging.getLogger(__name__)

TICKETMASTER_API_KEY = settings.TICKETMASTER_API_KEY  # Add to settings.py

def fetch_all_events_for_categories(categories):
    all_events = []
    base_url = 'https://app.ticketmaster.com/discovery/v2/events.json'
    for category in categories:
        params = {
            'classificationName': category,
            'countryCode': 'US',
            'apikey': TICKETMASTER_API_KEY,
            'size': 50
        }
        try:
            resp = requests.get(base_url, params=params)
            data = resp.json()
            if '_embedded' in data and 'events' in data['_embedded']:
                for item in data['_embedded']['events']:
                    all_events.append({
                        'title': item['name'],
                        'category': category,
                        'description': item.get('info', ''),
                        'url': item['url'],
                        'image_url': item['images'][0]['url'] if item.get('images') else '',
                        'location': item['_embedded']['venues'][0]['city']['name'] if item.get('_embedded') else '',
                        'date': item['dates']['start']['dateTime'],
                        'event_id': hashlib.sha256((item['name'] + item['url']).encode()).hexdigest()
                    })
        except Exception as e:
            logger.error(f"Error fetching events for {category}: {str(e)}")
    return all_events

def save_events_to_db(events):
    for e in events:
        if Event.objects.filter(event_id=e['event_id']).exists():
            continue
        try:
            Event.objects.create(**e)
        except IntegrityError as err:
            logger.error(f"Integrity error for {e['title']}: {str(err)}")
