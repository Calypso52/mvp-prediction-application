from bs4 import BeautifulSoup
import requests
from requests.exceptions import RequestException
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
from selenium.webdriver.common.by import By
import pandas as pd

####################
# for the ongoing season
####################

####################
# you can get the headshot with transparent background!
####################


images = list()
teams = list()

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


def bts_get_info(soup):
    tbody = soup.find_all("tbody")
    trs = tbody[0].find_all("tr")
    for tr in trs:
        a = tr.find_all("a")
        td = tr.find_all("td")
        teams.append(team_match.get(td[1].text))
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
    return images, teams


def get_one_page(url, headers=None):
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.text
        return None
    except RequestException:
        return None


if __name__ == "__main__":
    images, teams = get_page_selenium()
    assert len(images) == 505
    assert len(teams) == 505
    df = pd.DataFrame(images, columns=["src"])
    df.to_csv("photo_src.csv", index=False)
