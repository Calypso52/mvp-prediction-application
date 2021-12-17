import numpy as np
import pandas as pd
from imblearn.over_sampling import *
import collections


def load_datasets(path1, path2, predict=False):
    season1 = pd.read_csv(path1)
    mip_stats_season1 = season1.iloc[:, [1,5,6,7,8,9,10]].values
    # mip_stats_season1[:, 1:] = normalize(mip_stats_season1[:, 1:], axis=0)
    season2 = pd.read_csv(path2)
    if predict:
        mip_stats_season2 = season2.iloc[:, 1:8].values
        # mip_stats_season2[:, 1:] = normalize(mip_stats_season2[:, 1:], axis=0)
    else:
        mip_stats_season2 = season2.iloc[:, [1,3,5,6,7,8,9,10]].values
        # mip_stats_season2[:, 2:] = normalize(mip_stats_season2[:, 2:], axis=0)
    return mip_stats_season1, mip_stats_season2


def csv2dict(csv_data):
    d = collections.defaultdict(list)
    for data in csv_data:
        d[data[0]] = data[1:]
    return d


def data_merge(stats1_dict, stats2_dict, year=2021, predict=False):
    """
    return a list, including the relative improvement of players
    """
    improvements = list()
    labels = list()
    names = list()
    for name in stats2_dict:
        if predict:
            cur_stats2 = stats2_dict[name]
            label = None
        else:
            cur_stats2 = stats2_dict[name][1:]
            label = stats2_dict[name][0]
        if name in stats1_dict:
            names.append(name)
            cur_stats1 = stats1_dict[name]
            # temp = ((cur_stats2 - cur_stats1) / (cur_stats1 + 1e-6)).flatten()
            # for i in range(len(temp)):
            #     if temp[i] > 100:
            #         temp[i] = (cur_stats2[i] - cur_stats1[i]) / 10
            # improvements.append(temp)
            improvements.append((cur_stats2 - cur_stats1).flatten())
            if label is not None:
                labels.append(label)
    improvements = np.asarray(improvements)
    if labels:
        labels = np.asarray(labels)
    df = pd.DataFrame(improvements, columns=["reb", "ast", "stl", "blk", "tov", "pts"])
    if len(labels):
        df["label"] = labels
    if predict:
        names = np.asarray(names)
        df["name"] = names
    df.to_csv("player_improvement_" + str(year) + "_" + str(year+1) + ".csv", index=False)
    return improvements, labels


stats_18_19_train, stats_19_20_train = load_datasets("player_stats_2018_2019.csv", "player_stats_2019_2020.csv")
stats_19_20_test, stats_20_21_test = load_datasets("player_stats_2019_2020.csv", "player_stats_2020_2021.csv")
stats_20_21_predict, stats_21_22_predict = load_datasets("player_stats_2020_2021.csv", "player_stats_2021_2022.csv", predict=True)
stats_18_19_train = csv2dict(stats_18_19_train)
stats_19_20_train = csv2dict(stats_19_20_train)
stats_19_20_test = csv2dict(stats_19_20_test)
stats_20_21_test = csv2dict(stats_20_21_test)
stats_20_21_predict = csv2dict(stats_20_21_predict)
stats_21_22_predict = csv2dict(stats_21_22_predict)
stats_merged_19_20, label_19_20 = data_merge(stats_18_19_train, stats_19_20_train, year=2019)
stats_merged_20_21, label_20_21 = data_merge(stats_19_20_test, stats_20_21_test, year=2020)
stats_merged_21_22, label_21_22 = data_merge(stats_20_21_predict, stats_21_22_predict, year=2021, predict=True)
assert not label_21_22
