# coding:utf-8

import json
import sqlite3
import math

attribute_index = {
    1: 'smile',
    2: 'pure',
    3: 'cool'
}


class Team:
    def __init__(self, team_json=None):
        self.members = list()

        if team_json:
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
                    WHERE unit_skill_m.unit_skill_id = (
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
                    WHERE unit_type_id = (
                        SELECT unit_type_id
                        FROM unit_m
                        WHERE unit_number = ?
                    )
                '''

                # 查 leader 技能
                sql_leader_skill = '''
                    SELECT unit_leader_skill_m.name, unit_leader_skill_m.description,
                           unit_leader_skill_m.leader_skill_effect_type,
                           unit_leader_skill_m.effect_value
                    FROM unit_leader_skill_m
                    WHERE unit_leader_skill_id = (
                        SELECT default_leader_skill_id
                        FROM unit_m
                        WHERE unit_number = ?
                    )
                '''

                # 查副 leader 技能
                sql_leader_skill_extra = '''
                    SELECT unit_leader_skill_extra_m.member_tag_id,
                           unit_leader_skill_extra_m.leader_skill_effect_type,
                           unit_leader_skill_extra_m.effect_value
                    FROM unit_leader_skill_extra_m
                    WHERE unit_leader_skill_id = (
                        SELECT default_leader_skill_id
                        FROM unit_m
                        WHERE unit_number = ?
                    )
                '''

                skill_info_keys = ('skill_name', 'skill_effect_type', 'discharge_type',
                                   'trigger_type', 'description', 'effect_value',
                                   'trigger_value', 'activation_rate')

                leader_skill_info_keys = ('leader_skill_name', 'description',
                                          'effect_type_id', 'effect_value')

                leader_skill_extra_info_keys = ('tag',
                                                'effect_type_id',
                                                'effect_value')

                self.leader = self.members[4]

                # 根据 leader 属性确定队伍默认属性
                curs.execute('SELECT attribute_id FROM unit_m WHERE unit_number = ?',
                             (self.leader['cardid'],))
                self.default_attribute_id = curs.fetchall()[0][0]

                # 获取 leader 技能
                curs.execute(sql_leader_skill, (self.leader['cardid'],))
                leader_skill_result = curs.fetchall()
                self.leader_skill_info = None

                # 如果 leader 技能存在
                if leader_skill_result:
                    self.leader_skill_info = dict(zip(leader_skill_info_keys, leader_skill_result[0]))

                    effect_type = self.leader_skill_info['effect_type_id']
                    if effect_type in (1, 2, 3):
                        self.leader_skill_info['effect_type_id'] = effect_type
                    elif effect_type > 100:
                        self.leader_skill_info['effect_type_id'] = (effect_type / 10) % 10

                # 获取副 leader 技能
                curs.execute(sql_leader_skill_extra, (self.leader['cardid'], ))
                leader_skill_extra_result = curs.fetchall()
                self.leader_skill_extra_info = None
                if leader_skill_extra_result:
                    self.leader_skill_extra_info = dict(zip(leader_skill_extra_info_keys, leader_skill_extra_result[0]))

                # 获取全体宝石信息
                self.gemallpercent = list()
                for member in self.members:
                    self.gemallpercent.append(member['gemallpercent'])

                for member in self.members:

                    # 查询技能信息
                    curs.execute(sql_skill, (member['cardid'], member['skilllevel']))
                    skill_result = curs.fetchall()
                    member['skill_info'] = None
                    if skill_result:
                        skill_info = dict(zip(skill_info_keys, skill_result[0]))
                        member['skill_info'] = skill_info

                    # 查询成员
                    curs.execute('SELECT name, attribute_id FROM unit_m WHERE unit_number = ?',
                                 (member['cardid'], ))
                    # member['name'] = curs.fetchall()[0]
                    member.update(dict(zip(('name', 'attribute'), (curs.fetchall()[0]))))

                    # 查询小队信息
                    curs.execute(sql_member_tag, (member['cardid'], ))
                    member['tag'] = map(lambda x: x[0], curs.fetchall())
                    member['unit'] = None
                    if 4 in member['tag']:
                        member['unit'] = "μ's"
                    elif 5 in member['tag']:
                        member['unit'] = 'Aqours'

    def calculate_total(self, attribute_id):
        attribute = attribute_index[attribute_id]  # attribute 是属性的字符串，如 'smile'
        total = 0

        # 若所求属性和 leader 属性一致
        if attribute_id is self.default_attribute_id:
            for member in self.members:
                # 该卡裸属性
                bare_attribute = member[attribute]

                # 单体宝石的加成
                gem_single_bonus = member['gemnum'] + math.ceil(bare_attribute * member['gemsinglepercent'])

                # 全体宝石的加成
                gem_all_bonus = 0
                for value in self.gemallpercent:
                    gem_all_bonus += math.ceil(bare_attribute * value)

                # 队伍宝石对该卡的总加成
                gem_bonus_attribute = bare_attribute + gem_single_bonus + gem_all_bonus

                # leader 技能对该卡的加成
                leader_skill_bonus = 0
                if self.leader_skill_info:
                    effect_type_id = self.leader_skill_info['effect_type_id']
                    effect_type = attribute_index[effect_type_id]

                    # 如果是旧 C
                    if effect_type_id is self.default_attribute_id:
                        leader_skill_bonus = math.ceil(gem_bonus_attribute *
                                                       self.leader_skill_info['effect_value'] / 100)
                    else:
                        leader_skill_bonus = math.ceil(member[effect_type] *
                                                       self.leader_skill_info['effect_value'] / 100)

                # print leader_skill_bonus
                # 副 leader技能对该卡的加成
                leader_skill_extra_bonus = 0
                if self.leader_skill_extra_info:
                    if self.leader_skill_extra_info['tag'] in member['tag']:
                        leader_skill_extra_bonus = math.ceil(gem_bonus_attribute *
                                                             self.leader_skill_extra_info['effect_value'] / 100)
                member_total = gem_bonus_attribute + leader_skill_bonus + leader_skill_extra_bonus
                total += member_total
            return total
        else:
            for member in self.members:
                total += member[attribute]
            return total

    def show_members_info(self):
        for member in self.members:
            print '----------------------------------------'
            for key, value in member.iteritems():
                if key is 'skill_info':
                    print '%16s : ' % ('skill_info',)
                    for k, v in member['skill_info'].iteritems():
                        print '%16s%20s : %s' % (u'|', k, v)
                else:
                    print '%16s : %s' % (key, value)

    def show_leader_skill_info(self):
        for key, value in self.leader_skill_info.iteritems():
            print '%20s : %s' % (key, value)


if __name__ == '__main__':
    red_aqours = Team(u"../data/team/紅[Aqours].sd")
    print red_aqours.calculate_total(1)
