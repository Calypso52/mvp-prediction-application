from bs4 import BeautifulSoup
import collections
import pandas as pd
import uuid
from utils import *


if __name__ == "__main__":
    url = 'https://www.basketball-reference.com/leagues/NBA_2021_totals.html'
    candidates = ["Nikola Jokic", "Joel Embiid", "Stephen Curry", "Giannis Antetokounmpo",
                  "Chris Paul", "Chris Paul", "Luka Doncic", "Damian Lillard", "Julius Randle",
                  "Derrick Rose", "Rudy Gobert", "Russell Westbrook", "Ben Simmons", "James Harden",
                  "LeBron James", "Kawhi Leonard"]
    mip_candidates = {"Jerami Grant": 140, "Michael Porter": 138, "Julius Randle": 493, "Christian Wood": 44, "Chris Boucher": 10,
                      "Mikal Bridges": 8, "Zion Williamson": 6, "Nikola Vucevic": 3, "Clint Capela": 3, "Jordan Poole": 3,
                      "Jordan Clarkson": 3, "Luguentz Dort": 3, "Darius Garland": 3, "Kyle Anderson": 2, "RJ Barrett": 2,
                      "Miles Bridges": 2, "Lonzo Ball": 1, "T.J. McConnell": 1, "Andrew Wiggins": 1, "Richaun Holmes": 1,
                      "Bojan Bogdanovic": 1, "Terry Rozier": 1, "Shai Gilgeous-Alexander": 1}
    mip_candidates = label_redistribution(mip_candidates)
    dp_candidates = ["Rudy Gobert", "Draymond Green", "Ben Simmons", "Bam Adebayo", "Giannis Antetokounmpo",
                     "Clint Capela", "Joel Embiid", "Jrue Holiday", "Myles Turner", "Jimmy Butler",
                     "Kentavious Caldwell-Pope", "Matisse Thybulle"]
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

    df = pd.DataFrame.from_records(stats, columns=list(personal_stat.keys()))
    df.rename(columns={"trb": "reb"}, inplace=True)
    df.pts = df.pts / df.g
    df.reb = df.reb / df.g
    df.ast = df.ast / df.g
    df.blk = df.blk / df.g
    df.stl = df.stl / df.g
    df.tov = df.tov / df.g
    df = df.drop(columns="g")
    df.to_csv("player_stats_2020_2021.csv", index=False, encoding='utf_8_sig')
