# coding:utf-8

from __future__ import absolute_import
from __future__ import print_function
import json
import math
from card_manager.team import Team


class LiveCalculator:
    def __init__(self):
        self.live_info = None
        self.live_notes = None
        self.team = None
        # load all lives info from maps.json
        with open(u'../data/maps/maps.json') as fp:
            self.all_lives_info = json.load(fp)
        if self.all_lives_info:
            print('Live info loaded.')

    def test(self):
        effect_enum = list()
        for live_info in self.all_lives_info:
            notes_json = live_info['notes_setting_asset']
            with open(u'../assets/maps/latest/' + notes_json) as fp:
                live_notes = json.load(fp)
                for note in live_notes:
                    if note['effect'] not in effect_enum:
                        effect_enum.append(note['effect'])
                        print('effect_type:')
                        print(note['effect'])
                        print('appearred in:')
                        print(live_info['live_setting_id'])

    def set_team(self, team):
        self.team = team

    # Some live info tips:
    #
    # live_info['difficulty']:
    # {
    #  1: 'EASY',
    #  2: 'NORMAL',
    #  3: 'HARD',
    #  4: 'EXPERT',
    #  5: 'TECHNICAL',
    #  6: "MASTER"
    # }
    #
    # live_info['member_category']:
    # {
    #  1: "μ's"
    #  2: "Aqours"
    # }

    def set_live(self, live_id):
        # Search for target live
        for live_info in self.all_lives_info:
            if live_info['live_setting_id'] == live_id:
                self.live_info = live_info
                notes_json = live_info['notes_setting_asset']
                with open(u'../data/maps/latest/' + notes_json) as fp:
                    self.live_notes = json.load(fp)
                break

        # Add slider ending info
        if self.live_notes:
            for note in self.live_notes:
                # if this note is a slider
                if note['effect'] == 3:
                    end_note = dict(note)
                    end_note['effect'] = 99
                    end_note['timing_sec'] = note['timing_sec'] + note['effect_value'] + 0.001
                    end_note['effect_value'] = note['timing_sec']
                    self.live_notes.append(end_note)
            # sort by key 'timing_sec'
            self.live_notes = sorted(self.live_notes, key=lambda d: d['timing_sec'])

    @staticmethod
    def get_combo_factor(combo):
        if 0 <= combo <= 50:
            return 1.00
        elif combo <= 100:
            return 1.10
        elif combo <= 200:
            return 1.15
        elif combo <= 400:
            return 1.20
        elif combo <= 600:
            return 1.25
        elif combo <= 800:
            return 1.30
        else:
            return 1.35

    @staticmethod
    def get_judge_factor(judge):
        if judge == 'Perfect':
            return 1.00
        if judge == 'Great':
            return 0.88
        if judge == 'Good':
            return 0.80
        if judge == 'Bad':
            return 0.40
        if judge == 'Miss':
            return 0.00
        return 0.00

    def calculate_team_strength(self):
        pass

    # max_combo means the max combo reached when you cannot full combo
    # When reaching the max combo, next icon will be "miss"
    # 0 is default value and indicates full combo
    # When full combo, you will get only perfect and great
    def calculate_expected_score(self, perfect_rate, max_combo=0):
        returns = {}
        attribute_score = 0
        skill_score = 0
        total_score = 0

        live_attribute_id = self.live_info['attribute_icon_id']
        live_category = self.live_info['member_category']
        members = self.team.members
        team_total_attribute = self.team.calculate_total_attribute(self.live_info['attribute_icon_id'])
        returns['team_total_attribute'] = team_total_attribute

        # Calculate type factor for every member
        for member in members:
            type_factor = 1.0
            if member['attribute_id'] == live_attribute_id:
                type_factor *= 1.1
            if member['tag']:
                if member['tag'][1] == (live_category + 3):
                    type_factor *= 1.1
            member['type_factor'] = type_factor

        basic_score = team_total_attribute * 0.0125
        star_note_count = 0
        token_note_count = 0
        slider_note_count = 0
        current_combo = 0
        total_note_count = 0
        result_combo = 0

        if max_combo == 0:
            for note in self.live_notes:
                position = 9 - note['position']
                type_factor = members[position]['type_factor']
                combo_factor = self.get_combo_factor(current_combo)

                # (1, 2, 4) indicates single note
                # 1 indicates normal single note
                # 2 indicates taken single note
                # 4 indicates star single note
                if note['effect'] in (1, 2, 4):
                    p_score = math.floor(basic_score * type_factor * combo_factor * 1.00)
                    g_score = math.floor(basic_score * type_factor * combo_factor * 0.88)
                    note_expected_score = perfect_rate * p_score + (1 - perfect_rate) * g_score

                    attribute_score += note_expected_score
                    current_combo += 1.0
                    total_note_count += 1.0

                    if note['effect'] == 4:
                        star_note_count += 1.0

                    if note['effect'] == 2:
                        token_note_count += 1.0

                # 99 indicates slider ending
                if note['effect'] == 99:
                    pp_score = math.floor(basic_score * type_factor * combo_factor * 1.00 * 1.25)
                    pg_score = math.floor(basic_score * type_factor * combo_factor * 0.88 * 1.25)
                    gg_score = math.floor(basic_score * type_factor * combo_factor * (0.88 ** 2) * 1.25)
                    note_expected_score = perfect_rate ** 2 * pp_score + \
                        2 * perfect_rate * (1 - perfect_rate) * pg_score + \
                        (1 - perfect_rate) ** 2 * gg_score

                    attribute_score += note_expected_score
                    current_combo += 1.0
                    total_note_count += 1.0
                    slider_note_count += 1.0

            # A slider note has a start and a ending.
            # Only when twice is perfect, the perfect lock can be triggered,
            # in this way the total perfect rate would be a little smaller
            slider_perfect_rate = perfect_rate ** 2
            slider_note_proportion = slider_note_count / total_note_count
            total_perfect_rate = slider_note_proportion * slider_perfect_rate + (1 -
                                                                                 slider_note_proportion) * perfect_rate

            # perfect count is not certain itself, so it doesn't floored here
            perfect_count = total_note_count * total_perfect_rate

            for member in members:
                skill_info = member['skill_info']
                if skill_info:
                    skill_expected_score = 0

                    # 'skill_effect_type': 11 indicates score up skill
                    if skill_info['skill_effect_type'] == 11:

                        # 'trigger_type': 3 indicates icon
                        if skill_info['trigger_type'] == 3:
                            skill_expected_score = math.floor(total_note_count / skill_info['trigger_value']) * \
                                                   skill_info['activation_rate'] / 100.0 * skill_info['effect_value']

                        # 'trigger_type': 4 indicates combo
                        if skill_info['trigger_type'] == 4:
                            skill_expected_score = math.floor(total_note_count / skill_info['trigger_value']) * \
                                                   skill_info['activation_rate'] / 100.0 * skill_info[
                                                       'effect_value']

                        # 'trigger_type': 6 indicates Perfect
                        if skill_info['trigger_type'] == 6:

                            skill_expected_score = math.floor(perfect_count / skill_info['trigger_value']) * \
                                skill_info['activation_rate'] / 100.0 * skill_info['effect_value']

                        # 'trigger_type': 12 indicates star icon
                        if skill_info['trigger_type'] == 12:
                            skill_expected_score = math.floor(star_note_count / skill_info['trigger_value']) * \
                                                   skill_info['activation_rate'] / 100.0 * skill_info[
                                                       'effect_value']

                    skill_score += skill_expected_score

            total_score = attribute_score + skill_score
            returns['total_score'] = total_score
            total_scoring_up_rate = 0

            # Burst scoring up cards expected scoring bonus (e.g. スコア15000達成ごとに13%の確率でスコアが1120増える)
            for member in members:
                skill_info = member['skill_info']
                total_scoring_up_rate = 0
                if skill_info:
                    if skill_info['skill_effect_type'] == 11:
                        # 'trigger_type': 5 indicates score
                        if skill_info['trigger_type'] == 5:
                            scoring_up_rate = skill_info['effect_value'] / skill_info['trigger_value'] * \
                                              skill_info['activation_rate'] / 100.0
                            total_scoring_up_rate += scoring_up_rate
            total_score /= (1 - total_scoring_up_rate)
            returns['total_score_burst'] = total_score
            returns['slider_note_count'] = slider_note_count
            print('raw score: {}, total_score: {}, slider_note_count: {}'.format(returns['total_score'], returns['total_score_burst'], returns['slider_note_count']))
            return returns

    def calculate_timing_coverage(self):
        pass

    def calculate(self):
        pass


if __name__ == '__main__':
    red_muse = Team(u"../data/team/紅[μ's].sd")
    t = Team(u"../data/team/s.sd")
    red_guest = [[1, 9], [1, 6, 8]]
    # red_muse.add_guest(red_guest)
    lc = LiveCalculator()
    lc.set_live(563)
    lc.set_team(red_muse)
    lc.set_team(t)
    lc.calculate_expected_score(0.95)
    lc.team.show_members_info()




