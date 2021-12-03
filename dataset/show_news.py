from bs4 import BeautifulSoup
import requests
from requests.exceptions import RequestException
import collections
import unicodedata


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


def show_news(name):
    short_name = combos[name]
    url = 'https://www.basketball-reference.com/players/' + short_name[0] + '/' + short_name + '.html'
    html = get_one_page(url)
    soup = BeautifulSoup(html, features='html.parser')
    body = soup.find_all("body")
    warp = body[0].find_all("div")[0]
    content = warp.find_all("div")
    loc = 0
    for i in range(len(content)):
        if 'newsfeed_click' in str(content[i]):
            loc = i
    target = content[loc]
    news = target.contents[4]
    commentsoup = BeautifulSoup(news, 'lxml')
    news_url = commentsoup.find("div")
    news_url = news_url.find_all("li")
    hrefs = list()
    titles = list()
    for url in news_url:
        url_element = url.find("a")
        href = url_element["href"]
        title = url_element.text
        hrefs.append(href)
        titles.append(title)
    return titles, hrefs


if __name__ == "__main__":
    url = 'https://www.basketball-reference.com/leagues/NBA_2022_totals.html'
    html = get_one_page(url)
    soup = BeautifulSoup(html, features='html.parser')
    tbody = soup.find_all("tbody")
    trs = tbody[0].find_all("tr")
    combos = collections.defaultdict(str)
    name_package = set()
    for tr in trs:
        th = tr.find_all("th")
        if th[0].get("csk"):
            exist = False
            num = th[0]["csk"]
            td = tr.find_all("td")
            personal_stat = collections.defaultdict(int)
            for t in td:
                if t.get("csk"):
                    a = t.find_all("a")[0]
                    name = a.text
                    name = strip_accents(name)
                    if name not in name_package:
                        name_package.add(name)
                    else:
                        continue
                    link = a["href"].split("/")[-1].strip(".html")
                    combos[name] = link
    name = "Precious Achiuwa"
    titles, urls = show_news(name)

