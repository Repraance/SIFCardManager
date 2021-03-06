# coding=utf-8

from collections import OrderedDict
import json
import sqlite3


def get_unit_m():
    unit_m_field = ('unit_number', 'name', 'attribute_id', 'unit_type_id',
                    'default_unit_skill_id', 'default_leader_skill_id')
    unit_m = list()

    curs.execute('''SELECT unit_number, name, attribute_id, unit_type_id,
                           default_unit_skill_id,default_leader_skill_id
                    FROM unit_m''')
    result = curs.fetchall()
    for record in result:
        unit_m.append(OrderedDict(zip(unit_m_field, record)))

    with open('../static/json/unit_m.json', 'w') as fp:
        json.dump(unit_m, fp)


def get_unit_type_member_tag_m():
    unit_type_member_tag_m_field = ('unit_type_id', 'member_tag_id')
    unit_type_member_tag_m = list()

    curs.execute('SELECT unit_type_id, member_tag_id FROM unit_type_member_tag_m')
    result = curs.fetchall()

    for record in result:
        unit_type_member_tag_m.append(OrderedDict(zip(unit_type_member_tag_m_field, record)))

    with open('../static/json/unit_type_member_tag_m.json', 'w') as fp:
        json.dump(unit_type_member_tag_m, fp)


def get_unit_leader_skill_m():
    unit_leader_skill_m_field = ('unit_leader_skill_id', 'name', 'description',
                                 'leader_skill_effect_type', 'effect_value')
    unit_leader_skill_m = list()

    curs.execute('''SELECT unit_leader_skill_id, name, description, leader_skill_effect_type, effect_value
                    FROM unit_leader_skill_m''')
    result = curs.fetchall()

    for record in result:
        unit_leader_skill_m.append(OrderedDict(zip(unit_leader_skill_m_field, record)))

    for skill in unit_leader_skill_m:
        if skill['leader_skill_effect_type'] > 3:
            skill['leader_skill_effect_type'] = int(skill['leader_skill_effect_type'] / 10) % 10

    with open('../static/json/unit_leader_skill_m.json', 'w') as fp:
        json.dump(unit_leader_skill_m, fp)


def get_unit_leader_skill_extra_m():
    unit_leader_skill_extra_m_field = ('unit_leader_skill_id', 'member_tag_id',
                                       'leader_skill_effect_type', 'effect_value')
    unit_leader_skill_extra_m = list()

    curs.execute('''SELECT unit_leader_skill_id,member_tag_id, leader_skill_effect_type, effect_value
                    FROM unit_leader_skill_extra_m''')
    result = curs.fetchall()

    for record in result:
        unit_leader_skill_extra_m.append(OrderedDict(zip(unit_leader_skill_extra_m_field, record)))

    with open('../static/json/unit_leader_skill_extra_m.json', 'w') as fp:
        json.dump(unit_leader_skill_extra_m, fp)


def get_unit_skill_m():
    unit_skill_m_field = ('unit_skill_id', 'name', 'skill_effect_type', 'discharge_type', 'trigger_type')
    unit_skill_m = list()

    curs.execute('SELECT unit_skill_id, name, skill_effect_type, discharge_type, trigger_type FROM unit_skill_m')
    result = curs.fetchall()

    for record in result:
        unit_skill_m.append(OrderedDict(zip(unit_skill_m_field, record)))

    with open('../static/json/unit_skill_m.json', 'w') as fp:
        json.dump(unit_skill_m, fp)


def get_unit_skill_level_m():
    unit_skill_level_m_field = ('unit_skill_id', 'skill_level', 'description', 'effect_value', 'discharge_time',
                                'trigger_value', 'activation_rate')
    unit_skill_level_m = list()

    curs.execute('''SELECT unit_skill_id, skill_level, description,
                           effect_value, discharge_time, trigger_value, activation_rate
                    FROM unit_skill_level_m''')
    result = curs.fetchall()

    for record in result:
        unit_skill_level_m.append(OrderedDict(zip(unit_skill_level_m_field, record)))

    with open('../static/json/unit_skill_level_m.json', 'w') as fp:
        json.dump(unit_skill_level_m, fp)

    print(unit_skill_level_m)

if __name__ == '__main__':
    conn = sqlite3.connect('../data/db/unit.db_')
    curs = conn.cursor()

    get_unit_leader_skill_extra_m()
    get_unit_leader_skill_m()
    get_unit_m()
    get_unit_skill_level_m()
    get_unit_skill_m()
    get_unit_type_member_tag_m()
