from bs4 import BeautifulSoup
import collections
import pandas as pd
import uuid
from utils import *


if __name__ == "__main__":
    url = 'https://www.basketball-reference.com/leagues/NBA_2019_totals.html'
    candidates = ["Giannis Antetokounmpo", "James Harden", "Paul George", "Nikola Jokic",
                  "Stephen Curry", "Damian Lillard", "Joel Embiid", "Kevin Durant", "Kawhi Leonard",
                  "Russell Westbrook", "Rudy Gobert", "LeBron James"]
    mip_candidates = {"Pascal Siakam": 469, "D'Angelo Russell": 255, "De'Aaron Fox": 77, "Buddy Hield": 22, "Nikola Vucevic": 20,
                      "Domantas Sabonis": 10, "Montrezl Harrell": 9, "Derrick Rose": 8, "John Collins": 6, "Giannis Antetokounmpo": 4,
                      "Danilo Gallinari": 3, "Malik Beasley": 3, "Paul George": 3, "Thomas Bryant": 2,
                      "Bojan Bogdanovic": 2, "Willie Cauley‐Stein": 1, "Derrick White": 1, "Bryn Forbes": 1,
                      "Jerami Grant": 1, "Zach LaVine": 1, "Josh Richardson": 1, "Spencer Dinwiddie": 1}
    mip_candidates = label_redistribution(mip_candidates)
    dp_candidates = ["Rudy Gobert", "Giannis Antetokounmpo", "Paul George", "Joel Embiid", "Myles Turner",
                     "Draymond Green", "Kawhi Leonard", "Marcus Smart", "Jarrett Allen", "Patrick Beverley"]
    html = get_one_page(url)
    soup = BeautifulSoup(html, features='html.parser')

    stats = list()
    name_package = set()

    tbody = soup.find_all("tbody")
    trs = tbody[0].find_all("tr")

    for tr in trs:
        th = tr.find_all("th")
        if th[0].get("csk"):
            exist = False
            num = th[0]["csk"]
            td = tr.find_all("td")
            personal_stat = collections.defaultdict(int)
            for t in td:
                if t.get("csk"):
                    names = t["csk"].split(",")
                    name = names[1] + " " + names[0]
                    name = strip_accents(name)
                    if name not in name_package:
                        personal_stat["id"] = str(uuid.uuid4())
                        name_package.add(name)
                        personal_stat["name"] = name
                        personal_stat["mvpLabel"] = 1 if name in candidates else 0
                        personal_stat["mipLabel"] = mip_candidates[name] if name in mip_candidates else 0
                        personal_stat["dpoyLabel"] = 1 if name in dp_candidates else 0
                    else:
                        exist = True
                else:
                    if exist:
                        if stats[-1]["name"] == name:
                            if t["data-stat"] in ("pts", "trb", "ast", "blk", "stl", "tov", "g"):
                                personal_stat[t["data-stat"]] += int(t.text)
                    else:
                        if t["data-stat"] in ("pts", "trb", "ast", "blk", "stl", "tov", "g"):
                            personal_stat[t["data-stat"]] = int(t.text)
            if exist is False:
                stats.append(personal_stat)

        else:
            continue

    df = pd.DataFrame.from_records(stats, columns=["id", "name", "mvpLabel", "mipLabel", "dpoyLabel", "g", "trb",
                                                   "ast", "stl", "blk", "tov", "pts"])
    df.rename(columns={"trb": "reb"}, inplace=True)
    df.pts = df.pts / df.g
    df.reb = df.reb / df.g
    df.ast = df.ast / df.g
    df.blk = df.blk / df.g
    df.stl = df.stl / df.g
    df.tov = df.tov / df.g
    df = df.drop(columns="g")
    df.to_csv("player_stats_2018_2019.csv", index=False, encoding='utf_8_sig')
