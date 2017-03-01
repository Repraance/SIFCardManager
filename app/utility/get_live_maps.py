# coding=utf-8

import os
import json
import urllib.request


with open('../static/maps/live_setting.json') as fp:
    live_setting = json.load(fp)

url_common = 'https://rawfile.loveliv.es/livejson/'


def get_maps():
    for live in live_setting:
        file_name = live['notes_setting_asset']
        if not os.path.exists('../static/maps/latest/' + file_name):
            print(file_name)
            url = url_common + file_name
            urllib.request.urlretrieve(url, '../static/maps/latest/' + file_name)
        # print(file_name + 'successfully downloaded.')


if __name__ == '__main__':
    get_maps()
    print(len(live_setting))
