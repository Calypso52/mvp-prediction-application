from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
from selenium.webdriver.common.by import By
import datetime
import numpy as np
import pandas as pd


yesterday = str(datetime.date.today() - datetime.timedelta(days=1))
last_month = str(datetime.date.today() - datetime.timedelta(days=11))
start = last_month
end = yesterday
base_url = "https://pageviews.toolforge.org/?project=en.wikipedia.org&platform=all-access&agent=all-agents&redirects" \
           "=0&start=" + start + "&end=" + end + "&" \
           "pages="


if __name__ == "__main__":
    names = pd.read_csv("player_stats_2021_2022.csv").name
    search_volume = np.empty_like(names)
    ser = Service(ChromeDriverManager().install())
    op = webdriver.ChromeOptions()
    op.add_argument("headless")
    driver = webdriver.Chrome(service=ser, options=op)
    for i, name in enumerate(names):
        name = name.split()[0] + "_" + name.split()[1]
        url = base_url + name
        driver.get(url)
        time.sleep(0.8)
        element = driver.find_elements(By.XPATH, "//span[@class='pull-right']")
        for j in range(3, len(element)):
            if element[j-1].text == "" and element[j].text != "":
                num = element[j].text.replace(",", "")
                break
        search_volume[i] = int(num)
    driver.quit()
    with open("search_volume_" + yesterday + ".npy", "wb") as f:
        np.save(f, search_volume)

