from bs4 import BeautifulSoup
import requests
from requests.exceptions import RequestException
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
from selenium.webdriver.common.by import By
import pandas as pd
import unicodedata

####################
# for the ongoing season
####################

####################
# you can get the headshot with transparent background!
####################


images = list()
teamSrc = list()
teams = list()
names = list()

team_match = {"TOR": "Toronto Raptors",
              "MEM": "Memphis Grizzlies",
              "MIA": "Miami Heat",
              "BKN": "Brooklyn Nets",
              "NOP": "New Orleans Pelicans",
              "MIL": "Milwaukee Bucks",
              "CLE": "Cleveland Cavaliers",
              "LAL": "Los Angeles Lakers",
              "ORL": "Orlando Magic",
              "HOU": "Houston Rockets",
              "WAS": "Washington Wizards",
              "PHX": "Phoenix Suns",
              "UTA": "Utah Jazz",
              "SAC": "Sacramento Kings",
              "NYK": "New York Knicks",
              "DEN": "Denver Nuggets",
              "IND": "Indiana Pacers",
              "PHI": "Philadelphia 76ers",
              "CHI": "Chicago Bulls",
              "POR": "Portland Trail Blazers",
              "DAL": "Dallas Mavericks",
              "MIN": "Minnesota Timberwolves",
              "OKC": "Oklahoma City Thunder",
              "GSW": "Golden State Warriors",
              "ATL": "Atlanta Hawks",
              "CHA": "Charlotte Hornets",
              "LAC": "LA Clippers",
              "BOS": "Boston Celtics",
              "DET": "Detroit Pistons",
              "SAS": "San Antonio Spurs"
              }


prefix = "https://cdn.nba.com/logos/nba/"
suffix = "/primary/L/logo.svg"


def strip_accents(text):
    return ''.join(char for char in
                   unicodedata.normalize('NFKD', text)
                   if unicodedata.category(char) != 'Mn')


def bts_get_info(soup):
    tbody = soup.find_all("tbody")
    trs = tbody[0].find_all("tr")
    for tr in trs:
        a = tr.find_all("a")
        td = tr.find_all("td")
        p = td[0].find_all("p")
        name = p[0].text + " " + p[1].text
        if len(name.split()) > 2:
            sections = name.split()
            name = sections[0] + " " + sections[1]
        name = strip_accents(name)
        if name == "Didi Louzada":
            name = "Marcos Louzada Silva"
        names.append(name)
        team_info = td[1]
        team_name = team_match.get(team_info.text, "")
        teams.append(team_name)
        team_src = team_info.find_all("a")
        try:
            team_src = team_src[0]["href"].split("/")[2]
            teamSrc.append(prefix + team_src + suffix)
        except IndexError:
            teamSrc.append("")
        image = a[0].find_all("img")
        images.append(image[0]["src"])


def get_page_selenium():
    ser = Service(ChromeDriverManager().install())
    op = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=ser, options=op)
    url = "https://www.nba.com/players"
    driver.get(url)
    for page in range(11):
        soup = BeautifulSoup(driver.page_source, features="html.parser")
        bts_get_info(soup)
        if page == 10:
            break
        next_page = driver.find_element(By.XPATH, "//button[@title='Next Page Button']")
        next_page.click()
        time.sleep(3)

    driver.close()
    return images, teams, teamSrc


def get_one_page(url, headers=None):
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.text
        return None
    except RequestException:
        return None


if __name__ == "__main__":
    images, teams, teamSrc = get_page_selenium()
    assert len(images) == 505
    assert len(teams) == 505
    assert len(teamSrc) == 505
    data = pd.DataFrame()
    data["src"] = images
    data["teamSrc"] = teamSrc
    data["team"] = teams
    data["name"] = names
    data.to_csv("img_info.csv", index=False)

