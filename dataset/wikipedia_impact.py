from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
from selenium.webdriver.common.by import By


base_url = "https://pageviews.toolforge.org/?project=en.wikipedia.org&platform=all-access&agent=all-agents&redirects" \
           "=0&start=2020-11&end=2021-10&" \
           "pages="


if __name__ == "__main__":
    name = "Stephen Curry"
    name = name.split()[0] + "_" + name.split()[1]
    url = base_url + name
    ser = Service(ChromeDriverManager().install())
    op = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=ser, options=op)
    driver.get(url)
    time.sleep(1)
    element = driver.find_elements(By.XPATH, "//span[@class='pull-right']")
    print(element[11].text)

