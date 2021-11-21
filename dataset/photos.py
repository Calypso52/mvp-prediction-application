from bs4 import BeautifulSoup
import requests
from requests.exceptions import RequestException
import pandas as pd


def get_one_page(url, headers=None):
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.text
        return None
    except RequestException:
        return None


if __name__ == "__main__":
    url = 'https://www.basketball-reference.com/leagues/NBA_2021_totals.html'
    html = get_one_page(url)
    soup = BeautifulSoup(html, features='html.parser')

    tbody = soup.find_all("tbody")
    trs = tbody[0].find_all("tr")

    photos = list()
    base_url = "https://www.basketball-reference.com"

    for tr in trs:
        th = tr.find_all("th")
        if th[0].get("csk"):
            td = tr.find_all("td")
            a = td[0].find_all("a")
            the_short_url = a[0]["href"]
            split_url = the_short_url.split("/")
            player_url = base_url + the_short_url

            abbr = split_url[-1][:-5]
            photo_url = "/req/202106291/images" + split_url[0] + "/" + split_url[1] + "/" + abbr + ".jpg"
            if base_url + photo_url not in photos:
                photos.append(base_url + photo_url)
    assert len(photos) == 540
    df = pd.read_csv("player_stats_2020_2021.csv")
    df["src"] = photos
    df.to_csv("player_stats_2020_2021.csv", index=False, encoding='utf_8_sig')
