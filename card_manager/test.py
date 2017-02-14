# coding=utf-8

from collections import OrderedDict
from bs4 import BeautifulSoup
import sqlite3
import requests
import json


def get_song_length():
    r = requests.get('https://db.loveliv.es/live/info/234')
    s = BeautifulSoup(r.text, "html.parser")
    length_str = s.find_all("tbody")[-1].find('td').string
    length = float(length_str.split()[0])
    length_1000 = int(length * 1000)
    print(length_1000)


def get_JSON():
    conn = sqlite3.connect('../data/db/unit.db_')
    curs = conn.cursor()

    unit_m_field = ('unit_number', 'name', 'attribute_id', 'unit_type_id',
                    'default_unit_skill_id', 'default_leader_skill_id')
    unit_m = list()

    curs.execute('''SELECT unit_number, name, attribute_id, unit_type_id,
                           default_unit_skill_id,default_leader_skill_id
                    FROM unit_m''')
    result = curs.fetchall()
    for item in result:
        unit_m.append(OrderedDict(zip(unit_m_field, item)))

    with open('../data/json/unit_m.json', 'w') as fp:
        json.dump(unit_m, fp)

if __name__ == '__main__':
    get_JSON()
