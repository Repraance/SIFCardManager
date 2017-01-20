# coding:utf-8

from __future__ import absolute_import
from __future__ import print_function
import json
import sqlite3
import math
import sys
if sys.version_info[0] < 3:
    import urllib
    urlunqote = urllib.unquote
else:
    import urllib.parse
    urlunqote = urllib.parse.unquote
    unicode = str

    
attribute_index = {
    1: 'smile',
    2: 'pure',
    3: 'cool'
}

tag_index = {

}


class Team:
    def __init__(self, team_json=None):
        self.members = list()
        self.leader = None
        self.default_attribute_id = None
        self.leader_skill_info = None
        self.leader_skill_extra_info = None
        self.guest_leader_skill_info = None
        self.guest_leader_skill_extra_info = None
        self.gemallpercent = list()

        if team_json:
            with open(team_json) as fp:
                txt = fp.read()
                txt_encode = urlunqote(txt)
                raw_team_json = json.loads(txt_encode)
                for card in raw_team_json:
                    for key in card:
                        if type(card[key]) == unicode:
                            card[key] = float(card[key])
                    self.members.append(card)
                self.set_team_info()

    def set_team_info(self):
        # Set up sqlite connection and cursor
        conn = sqlite3.connect('../data/db/unit/unit.db_')
        curs = conn.cursor()

        # Inquire skill info
        sql_skill = '''
                            SELECT unit_skill_m.name,
                                   unit_skill_m.skill_effect_type,
                                   unit_skill_m.discharge_type,
                                   unit_skill_m.trigger_type,
                                   unit_skill_level_m.description,
                                   unit_skill_level_m.effect_value,
                                   unit_skill_level_m.discharge_time,
                                   unit_skill_level_m.trigger_value,
                                   unit_skill_level_m.activation_rate
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

        skill_info_keys = ('skill_name', 'skill_effect_type', 'discharge_type',
                           'trigger_type', 'description', 'effect_value', 'discharge_time',
                           'trigger_value', 'activation_rate')

        # Inquire member tag
        sql_member_tag = '''
                            SELECT unit_type_member_tag_m.member_tag_id
                            FROM unit_type_member_tag_m
                            WHERE unit_type_id = (
                                SELECT unit_type_id
                                FROM unit_m
                                WHERE unit_number = ?
                            )
                        '''

        # Inquire leader skill info
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

        leader_skill_info_keys = ('leader_skill_name', 'description',
                                  'effect_type_id', 'effect_value')

        # Inquire extra leader skill
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

        leader_skill_extra_info_keys = ('tag',
                                        'effect_type_id',
                                        'effect_value')

        self.leader = self.members[4]

        # Get team attribute/color by leader's attribute/color
        curs.execute('SELECT attribute_id FROM unit_m WHERE unit_number = ?',
                     (self.leader['cardid'],))
        self.default_attribute_id = curs.fetchall()[0][0]

        # Get leader skill
        curs.execute(sql_leader_skill, (self.leader['cardid'],))
        leader_skill_result = curs.fetchall()

        # If leader skill exist
        if leader_skill_result:
            self.leader_skill_info = dict(zip(leader_skill_info_keys, leader_skill_result[0]))

            effect_type = self.leader_skill_info['effect_type_id']
            if effect_type in (1, 2, 3):
                self.leader_skill_info['effect_type_id'] = effect_type
            elif effect_type > 100:
                self.leader_skill_info['effect_type_id'] = (effect_type / 10) % 10

        # Get extra leader skill
        curs.execute(sql_leader_skill_extra, (self.leader['cardid'],))
        leader_skill_extra_result = curs.fetchall()

        if leader_skill_extra_result:
            self.leader_skill_extra_info = dict(zip(leader_skill_extra_info_keys, leader_skill_extra_result[0]))

        # Get Aura/Veil school idol skills info (effect on the whole team)
        for member in self.members:
            self.gemallpercent.append(member['gemallpercent'])

        for member in self.members:

            # Inquire skill info
            curs.execute(sql_skill, (member['cardid'], member['skilllevel']))
            skill_result = curs.fetchall()
            member['skill_info'] = None
            if skill_result:
                skill_info = dict(zip(skill_info_keys, skill_result[0]))
                member['skill_info'] = skill_info
                if member['gemskill']:
                    member['skill_info']['effect_value'] *= 2.5

            # Inquire member's name and attribute_id
            curs.execute('SELECT name, attribute_id FROM unit_m WHERE unit_number = ?',
                         (member['cardid'],))
            # member['name'] = curs.fetchall()[0]
            member.update(dict(zip(('name', 'attribute_id'), (curs.fetchall()[0]))))

            # Inquire member's tag and unit
            curs.execute(sql_member_tag, (member['cardid'],))
            member['tag'] = list(map(lambda x: x[0], curs.fetchall()))
            member['unit'] = None
            if 4 in member['tag']:
                member['unit'] = "μ's"
            elif 5 in member['tag']:
                member['unit'] = 'Aqours'

    # The guest object would be a list that has this structure
    # [[<effect_type_id>, <effect_value], [<extra_effect_type_id>, <extra_effect_value>, <tag>]}
    def add_guest(self, guest):
        if guest[0]:
            self.guest_leader_skill_info = dict(zip(('effect_type_id', 'effect_value'),
                                                    guest[0]))
        if guest[1]:
            self.guest_leader_skill_extra_info = dict(zip(('effect_type_id',
                                                          'effect_value', 'tag'), guest[1]))

    def calculate_total_attribute(self, attribute_id):
        attribute = attribute_index[attribute_id]  # attribute is a string，e.g.'smile'
        total = 0

        # If target attribute agrees with the team default attribute
        if attribute_id is self.default_attribute_id:
            for member in self.members:
                # bare attribute value
                bare_attribute = member[attribute]

                # bonus from school idol skills effect on single member
                gem_single_bonus = member['gemnum'] + math.ceil(bare_attribute * member['gemsinglepercent'])

                # bonus from school idol skills effect on sthe whole team
                gem_all_bonus = 0
                for value in self.gemallpercent:
                    gem_all_bonus += math.ceil(bare_attribute * value)

                # bonus from all school idol skills
                gem_bonus_attribute = bare_attribute + gem_single_bonus + gem_all_bonus

                # bonus from leader skill
                leader_skill_bonus = 0
                if self.leader_skill_info:
                    effect_type_id = self.leader_skill_info['effect_type_id']
                    effect_type = attribute_index[effect_type_id]

                    # If old leader skill e.g.クールPが9%UPする
                    if effect_type_id is self.default_attribute_id:
                        leader_skill_bonus = math.ceil(gem_bonus_attribute *
                                                       self.leader_skill_info['effect_value'] / 100)

                    # If new leader skill e.g.スマイルPの12%分クールPがUPする
                    else:
                        leader_skill_bonus = math.ceil(member[effect_type] *
                                                       self.leader_skill_info['effect_value'] / 100)

                # bonus from extra leader skill
                leader_skill_extra_bonus = 0
                if self.leader_skill_extra_info:
                    if self.leader_skill_extra_info['tag'] in member['tag']:
                        leader_skill_extra_bonus = math.ceil(gem_bonus_attribute *
                                                             self.leader_skill_extra_info['effect_value'] / 100)

                # bonus from guest's leader skill
                guest_leader_skill_bonus = 0
                if self.guest_leader_skill_info:
                    effect_type_id = self.guest_leader_skill_info['effect_type_id']
                    effect_type = attribute_index[effect_type_id]

                    # If old leader skill e.g.クールPが9%UPする
                    if effect_type_id is self.default_attribute_id:
                        guest_leader_skill_bonus = math.ceil(gem_bonus_attribute *
                                                             self.guest_leader_skill_info['effect_value'] / 100)

                    # If new leader skill e.g.スマイルPの12%分クールPがUPする
                    else:
                        guest_leader_skill_bonus = math.ceil(member[effect_type] *
                                                             self.guest_leader_skill_info['effect_value'] / 100)

                # bonus from guest's extra leader skill
                guest_leader_skill_extra_bonus = 0
                if self.guest_leader_skill_extra_info:
                    if self.leader_skill_extra_info['tag'] in member['tag']:
                        guest_leader_skill_extra_bonus = math.ceil(gem_bonus_attribute *
                                                                   self.guest_leader_skill_extra_info['effect_value'] /
                                                                   100)
                member_total = gem_bonus_attribute + leader_skill_bonus + leader_skill_extra_bonus + \
                    guest_leader_skill_bonus + guest_leader_skill_extra_bonus
                total += member_total
            return total
        else:
            for member in self.members:
                total += member[attribute]
            return total

    def show_members_info(self):
        for member in self.members:
            print('----------------------------------------')
            for key, value in member.items():
                if key is 'skill_info':
                    print('%16s : ' % ('skill_info',))
                    for k, v in member['skill_info'].items():
                        print('%16s%20s : %s' % (u'|', k, v))
                else:
                    print('%16s : %s' % (key, value))

    def show_leader_skill_info(self):
        for key, value in self.leader_skill_info.iteritems():
            print('%20s : %s' % (key, value))

if __name__ == '__main__':

    # red_aqours = Team(u"../data/team/紅[Aqours].sd")
    # pure_aqours = Team(u"../data/team/緑[Aqours].sd")
    # cool_aqours = Team(u"../data/team/藍[Aqours].sd")
    # red_muse = Team(u"../data/team/紅[μ's].sd")
    # pure_muse = Team(u"../data/team/緑[μ's].sd")
    # cool_muse = Team(u"../data/team/藍[μ's].sd")
    # red_guest = [[1, 9], [1, 6, 8]]
    # red_aqours.add_guest(red_guest)
    # print red_aqours.calculate_total_attribute(1)
    # print pure_aqours.calculate_total_attribute(2)
    # print cool_aqours.calculate_total_attribute(3)
    # print red_aqours.leader_skill_extra_info
    t = Team(u"../data/team/s.sd")
    t.show_members_info()
    print(t.calculate_total_attribute(1))
