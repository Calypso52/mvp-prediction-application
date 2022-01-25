import requests
from requests.exceptions import RequestException
import unicodedata
import mpmath


def get_one_page(url, headers=None):
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.text
        return None
    except RequestException:
        return None


def strip_accents(text):
    return ''.join(char for char in
                   unicodedata.normalize('NFKD', text)
                   if unicodedata.category(char) != 'Mn')


def label_redistribution(candidates: dict):
    maxVal = max(candidates.values())
    for name in candidates:
        candidates[name] /= maxVal
    return candidates
