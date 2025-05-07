import requests

API_KEY = "rzjKcwMPVei76tiMc2RH6a5MHGXD4YEn"
BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json"

def fetch_events(city=None, start_date=None, end_date=None, genre=None, size=100):
    params = {
        "apikey": API_KEY,
        "size": size,
        "countryCode": "US",
    }
    if city:
        params["city"] = city
    if start_date:
        params["startDateTime"] = start_date + "T00:00:00Z"
    if end_date:
        params["endDateTime"] = end_date + "T23:59:59Z"
    if genre:
        params["classificationName"] = genre

    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        return response.json().get('_embedded', {}).get('events', [])
    return []
