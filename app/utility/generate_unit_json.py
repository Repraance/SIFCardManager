# coding=utf-8


from collections import OrderedDict
import sqlite3
import json

unit_m_field = ('unit_number', 'unit_type_id', 'eponym', 'name', 'rarity', 'attribute_id', 'default_unit_skill_id',
                'default_leader_skill_id', 'before_love_max', 'after_love_max',
                'before_level_max', 'after_level_max',
                'default_removable_skill_capacity', 'max_removable_skill_capacity',
                'disable_rank_up', 'unit_level_up_pattern_id',
                'hp_max', 'smile_max', 'pure_max', 'cool_max',
                'hp_diff', 'smile_diff', 'pure_diff', 'cool_diff')

sql_live_unit_m = '''
    SELECT unit_number, unit_type_id, eponym, name, rarity, attribute_id, default_unit_skill_id,
    default_leader_skill_id, before_love_max, after_love_max, before_level_max, after_level_max,
    default_removable_skill_capacity, max_removable_skill_capacity, disable_rank_up, unit_m.unit_level_up_pattern_id,
    hp_max, smile_max, pure_max, cool_max, hp_diff, smile_diff, pure_diff, cool_diff
    FROM unit_m, unit_level_up_pattern_m
    WHERE  unit_level_up_pattern_m.unit_level_up_pattern_id = unit_m.unit_level_up_pattern_id AND
           unit_level_up_pattern_m.unit_level = unit_m.before_level_max
'''

sql_leader_skill = '''
    SELECT name, description, leader_skill_effect_type, effect_value
    FROM unit_leader_skill_m
    WHERE unit_leader_skill_id = ?
'''
leader_skill_field = ('name', 'description', 'leader_skill_effect_type', 'effect_value')


sql_leader_extra_skill = '''
    SELECT member_tag_id, leader_skill_effect_type, effect_value
    FROM unit_leader_skill_extra_m
    WHERE unit_leader_skill_id = ?
'''
leader_extra_skill_field = ('member_tag_id', 'leader_skill_effect_type', 'effect_value')

sql_skill = '''
    SELECT name, skill_effect_type, discharge_type, trigger_type,
           description, effect_value, discharge_time, trigger_value, activation_rate
    FROM unit_skill_m, unit_skill_level_m
    WHERE unit_skill_m.unit_skill_id = ? AND unit_skill_m.unit_skill_id = unit_skill_level_m.unit_skill_id
'''

skill_field = ('name', 'skill_effect_type', 'discharge_type', 'trigger_type',
               'description', 'effect_value', 'discharge_time', 'trigger_value', 'activation_rate')


sql_member_tag = '''
    SELECT member_tag_id
    FROM unit_type_member_tag_m
    WHERE unit_type_id = ?
'''

unit = list()
conn = sqlite3.connect('../data/db/unit.db_')
curs = conn.cursor()

curs.execute(sql_live_unit_m)
result = curs.fetchall()
for record in result:
    unit.append(OrderedDict(zip(unit_m_field, record)))

for live in unit:
    # Get attribute before rank up
    live['smile'] = live['smile_max'] - live.pop('smile_diff')
    live['pure'] = live['pure_max'] - live.pop('pure_diff')
    live['cool'] = live['cool_max'] - live.pop('cool_diff')
    live['hp'] = live['hp_max'] - live.pop('hp_diff')

    # Get leader skill info
    curs.execute(sql_leader_skill, (live['default_leader_skill_id'], ))
    result_leader_skill = curs.fetchall()
    if result_leader_skill:
        leader_skill = OrderedDict(zip(leader_skill_field, result_leader_skill[0]))
        if leader_skill['leader_skill_effect_type'] > 3:
            leader_skill['leader_skill_effect_type'] = int(leader_skill['leader_skill_effect_type'] / 10) % 10
        live['leader_skill_info'] = leader_skill
    else:
        live['leader_skill_info'] = None

    # Get leader extra skill info
    curs.execute(sql_leader_extra_skill, (live['default_leader_skill_id'], ))
    result_leader_extra_skill = curs.fetchall()
    if result_leader_extra_skill:
        leader_extra_skill = OrderedDict(zip(leader_extra_skill_field, result_leader_extra_skill[0]))
        live['leader_extra_skill_info'] = leader_extra_skill
    else:
        live['leader_extra_skill_info'] = None

    # Get skill info
    curs.execute(sql_skill, (live['default_unit_skill_id'], ))
    result_skill = curs.fetchall()
    if result_skill:
        skill_info = list()
        for level in result_skill:
            skill_info.append(OrderedDict(zip(skill_field, level)))
        if len(skill_info) > 1:
            for i in range(1, 8):
                del skill_info[i]['name']
                del skill_info[i]['description']
        live['skill_info'] = skill_info
    else:
        live['skill_info'] = None

    # Get member tag
    curs.execute(sql_member_tag, (live['unit_type_id'], ))
    result_member_tag = curs.fetchall()
    if result_member_tag:
        live['member_tag'] = list(map(lambda x: x[0], result_member_tag))
    else:
        live['member_tag'] = None

    # print(live)
print(len(unit))

with open('../static/json/unit.json', 'w') as fp:
    json.dump(unit, fp)
