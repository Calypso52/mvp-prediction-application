import pandas as pd
import numpy as np


def load_dataset(path1, path2):
    technical_stats = pd.read_csv(path1)
    img_info = pd.read_csv(path2)
    return technical_stats.values, img_info.values


def merge(dataset1, dataset2):
    dataset1_list = list(dataset1)
    dataset1_sorted = np.asarray(sorted(dataset1_list, key=lambda x: x[1].split()[-1]))
    dataset2_list = list(dataset2)
    dataset2_sorted = np.asarray(sorted(dataset2_list, key=lambda x: x[-1].split()[-1]))
    pt2 = 0
    teams = list()
    imgs = list()
    teamSrc = list()
    for i in range(len(dataset1_sorted)):
        name = dataset1_sorted[i][1]
        sections = name.split()
        while (sections[1] != dataset2_sorted[pt2][-1].split()[-1]
               and sections[0][0] != dataset2_sorted[pt2][-1].split()[0][0]) or \
              (sections[0] != dataset2_sorted[pt2][-1].split()[0] and sections[-1][-2:] != dataset2_sorted[pt2][-1].split()[-1][-2:]):
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
