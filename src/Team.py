# coding:utf-8

import json
import sqlite3


class Team:
    def __init__(self, team_json=None):
        self.members = list()
        self.members_position = list()
        self.school_idol_skills = list()
        self.center_member = None
        self.center_skill = None

        if team_json is not None:
            with open(team_json) as fp:
                raw_team_json = json.load(fp)
                for card in raw_team_json:
                    self.members.append(card)

                # 建立sqlite连接和游标
                conn = sqlite3.connect('../data/db/unit/unit.db_')
                curs = conn.cursor()

                # 查技能信息
                sql_skill = '''
                    SELECT unit_skill_m.name, unit_skill_m.skill_effect_type,
                           unit_skill_m.discharge_type, unit_skill_m.trigger_type,
                           unit_skill_level_m.description, unit_skill_level_m.effect_value,
                           unit_skill_level_m.trigger_value, unit_skill_level_m.activation_rate
                    FROM unit_skill_m, unit_skill_level_m
                    WHERE unit_skill_m.unit_skill_id =
                    (
                        SELECT default_unit_skill_id
                        FROM unit_m
                        WHERE unit_number = ?
                    )
                    AND
                    unit_skill_level_m.unit_skill_id = unit_skill_m.unit_skill_id
                    AND
                    skill_level = ?
                '''

                # 查户口
                sql_member_tag = '''
                    SELECT unit_type_member_tag_m.member_tag_id
                    FROM unit_type_member_tag_m
                    WHERE unit_type_id =
                    (
                        SELECT unit_type_id
                        FROM unit_m
                        WHERE unit_number = ?
                    )
                '''
                skill_info_keys = ('skill_name', 'skill_effect_type', 'discharge_type',
                                   'trigger_type', 'description', 'effect_value',
                                   'trigger_value', 'activation_rate')

                for member in self.members:

                    # 查询技能信息
                    curs.execute(sql_skill, (member['cardid'], member['skilllevel']))
                    skill_info = dict(zip(skill_info_keys, curs.fetchall()[0]))
                    member['skill_info'] = skill_info

                    # 查询成员
                    curs.execute('SELECT name FROM unit_m WHERE unit_number = ?', (member['cardid'], ))
                    member['name'] = curs.fetchall()[0][0]

                    # 查询小队信息
                    curs.execute(sql_member_tag, (member['cardid'], ))
                    member['tag'] = map(lambda x: x[0], curs.fetchall())


    def set_members(self):
        pass

    def set_school_idol_skills(self):
        pass

    def set_members_position(self):
        pass

    def show_team_details(self):
        for member in self.members:
            for key, value in member.iteritems():
                print '%s : %s' % (key, value)


if __name__ == '__main__':
    red_aqours = Team(u"../data/team/紅[Aqours].sd")
    red_aqours.show_team_details()
