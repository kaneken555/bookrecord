# external_api_helpers.py
import os
import requests

def search_books_google_api(title):
    api_key = os.environ.get('GOOGLE_BOOKS_API_KEY')
    url = f'https://www.googleapis.com/books/v1/volumes?q=intitle:{title}&key={api_key}'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {'error': 'Failed to fetch data from Google Books API.'}
