import pandas as pd
import numpy as np


def load_dataset(path1, path2):
    technical_stats = pd.read_csv(path1)
    img_info = pd.read_csv(path2)
    return technical_stats.values, img_info.values


def IsAbbre(name1, name2):
    name1 = name1.split()
    first_name1 = name1[0].replace(".", "")
    name2 = name2.split()
    first_name2 = name2[0].replace(".", "")
    flag = False
    if len(first_name2) < len(first_name1) and first_name2 == first_name1[:len(first_name2)]:
        flag = True
    elif len(first_name1) < len(first_name2) and first_name1 == first_name2[:len(first_name1)]:
        flag = True
    elif first_name2.isupper() and set(first_name2.lower()).issubset(set(first_name1.lower())):
        flag = True
    return name1[1] == name2[1] and flag


def merge(dataset1, dataset2):
    dataset1_list = list(dataset1)
    dataset1_sorted = np.asarray(sorted(dataset1_list, key=lambda x: (x[1].split()[1], x[1].split()[0])))
    dataset2_list = list(dataset2)
    dataset2_sorted = np.asarray(sorted(dataset2_list, key=lambda x: (x[-1].split()[1], x[-1].split()[0])))
    pt2 = 0
    teams = list()
    imgs = list()
    teamSrc = list()
    for i in range(len(dataset1_sorted)):
        name = dataset1_sorted[i][1]
        # print(name, i, pt2)
        while name != dataset2_sorted[pt2][-1]:
            name2 = dataset2_sorted[pt2][-1]
            if len(name) != len(name2) and IsAbbre(name, name2):
                break
            pt2 += 1
        teams.append(dataset2_sorted[pt2][-2])
        imgs.append(dataset2_sorted[pt2][0])
        teamSrc.append(dataset2_sorted[pt2][1])
        # pt2 += 1
    return teams, imgs, teamSrc


if __name__ == "__main__":
    technical_stats, img_info = load_dataset("player_stats_2021_2022.csv", "img_info.csv")
    teams, imgs, teamSrc = merge(technical_stats, img_info)
    assert len(teams) == 466
    df = pd.read_csv("player_stats_2021_2022.csv")
    df["src"] = imgs
    df["teamSrc"] = teamSrc
    df["team"] = teams
    df.to_csv("player_stats_2021_2022.csv", index=False, encoding='utf_8_sig')
