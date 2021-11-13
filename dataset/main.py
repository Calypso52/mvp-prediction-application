from bs4 import BeautifulSoup
import requests
from requests.exceptions import RequestException
from collections import defaultdict
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

    stats = list()

    tbody = soup.find_all("tbody")
    trs = tbody[0].find_all("tr")

    for tr in trs:
        th = tr.find_all("th")
        if th[0].get("csk"):
            num = th[0]["csk"]
            td = tr.find_all("td")
            personal_stat = defaultdict(int)
            for t in td:
                if t.get("csk"):
                    names = t["csk"].split(",")
                    name = names[0] + " " + names[1]
                    personal_stat["name"] = name
                else:
                    if t["data-stat"] in ("pts", "trb", "ast", "blk", "stl", "tov"):
                        personal_stat[t["data-stat"]] = int(t.text)
            stats.append(personal_stat)
        else:
            continue

    df = pd.DataFrame.from_records(stats, columns=list(personal_stat.keys()))
    df.to_csv("player_stats_2020_2021.csv", index=False, encoding='utf_8_sig')
