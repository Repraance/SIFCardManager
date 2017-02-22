# coding=utf-8

import json
import urllib.request


with open('../data/maps/live_setting.json') as fp:
    live_setting = json.load(fp)

url_common = 'https://rawfile.loveliv.es/livejson/'


def get_maps():
    for live in live_setting:
        file_name = live['notes_setting_asset']
        url = url_common + file_name
        urllib.request.urlretrieve(url, '../data/maps/latest/' + file_name)
        print(file_name + 'successfully downloaded.')


if __name__ == '__main__':
    lives = list()
    for live in live_setting:
        file_name = live['notes_setting_asset']
        if file_name not in lives:
            lives.append(file_name)
    print(len(lives))
