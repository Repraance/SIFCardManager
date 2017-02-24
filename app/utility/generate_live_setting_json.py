# coding=utf-8


from collections import OrderedDict
import sqlite3
import json
import os
import sys

parent_path = os.path.dirname(sys.path[0])
if parent_path not in sys.path:
    sys.path.append(parent_path)

live_setting_m_field = ('live_setting_id', 'live_track_id',
                        'name', 'name_kana', 'title_asset', 'member_category', 'member_tag_id',
                        'difficulty', 'stage_level', 'attribute_icon_id',
                        'live_icon_asset', 'notes_setting_asset', 'asset_background_id', 'notes_speed',
                        's_rank_score', 'a_rank_score', 'b_rank_score', 'c_rank_score',
                        's_rank_combo', 'a_rank_combo', 'b_rank_combo', 'c_rank_combo')

sql_live_setting_m = '''
    SELECT live_setting_id, live_setting_m.live_track_id,
           name, name_kana, title_asset, member_category, member_tag_id,
           difficulty, stage_level, attribute_icon_id,
           live_icon_asset, notes_setting_asset, asset_background_id, notes_speed,
           s_rank_score, a_rank_score, b_rank_score, c_rank_score,
           s_rank_combo, a_rank_combo, b_rank_combo, c_rank_combo
    FROM live_setting_m, live_track_m
    WHERE live_setting_m.live_track_id = live_track_m.live_track_id
'''

difficulty_index = {
    1: 'EASY',
    2: 'NORMAL',
    3: 'HARD',
    4: 'EXPERT',
    5: 'TECHNICAL',
    6: 'MASTER'
}

if __name__ == '__main__':
    live_setting = list()
    conn = sqlite3.connect('../data/db/live.db_')
    curs = conn.cursor()

    curs.execute(sql_live_setting_m)
    result = curs.fetchall()
    for record in result:
        live_setting.append(OrderedDict(zip(live_setting_m_field, record)))

    for live in live_setting:
        live['difficulty_text'] = difficulty_index[live['difficulty']]

    with open('../static/maps/live_setting.json', 'w') as fp:
        json.dump(live_setting, fp)
