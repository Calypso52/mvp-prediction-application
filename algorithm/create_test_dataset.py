import csv

datasets = ['../dataset/player_stats_2019_2020.csv', '../dataset/player_stats_2020_2021.csv', '../dataset/player_stats_2021_2022.csv']
new_fields = ['id', 'name', 'label', 'reb', 'ast', 'stl', 'blk', 'tov', 'pts', 'new_request', 'percentage']

def main():
    for dataset in datasets:
        rows = []
        with open(dataset, 'r', encoding='utf-8') as ds_file:
            csvreader = csv.reader(ds_file)
            fields = next(csvreader)

            print(fields)
            for row in csvreader:
                row.append('1')
                row.append('0')
                rows.append(row)
        modified_name = dataset[:-4] + '_test.csv'
        # print(rows)
        with open(modified_name, 'w', encoding='utf-8', newline='') as new_file:
            csvwriter = csv.writer(new_file)
            csvwriter.writerow(new_fields)
            csvwriter.writerows(rows)


if __name__ == "__main__":
    main()