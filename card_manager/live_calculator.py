# coding:utf-8

from __future__ import absolute_import
from __future__ import print_function
import json
import math
import time
from card_manager.team import Team


class LiveCalculator:
    def __init__(self):
        self.live_info = None
        self.live_notes = None
        self.live_notes_count = 0
        self.live_notes_count_slider_twice = 0
        self.live_length = 0
        self.team = None
        # load all lives info from maps.json
        with open(u'../data/maps/maps.json') as fp:
            self.all_lives_info = json.load(fp)
        if self.all_lives_info:
            print('Lives info loaded.\n')

    def test(self):
        for note in self.live_notes:
            print(note)

    def set_team(self, team):
        self.team = team

    # Some live info tips:
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
            self.live_notes_count = len(self.live_notes)
            for note in self.live_notes:
                # Multiply note['timing_sec'] by 1000 to make it a int
                if note['effect'] in (1, 2, 3, 4):
                    note['timing_sec'] = int(note['timing_sec'] * 1000)
                # if this note is a slider
                if note['effect'] == 3:
                    note['effect_value'] = int(note['effect_value'] * 1000)
                    end_note = dict(note)
                    end_note['effect'] = 99
                    end_note['timing_sec'] = note['timing_sec'] + note['effect_value'] + 1
                    end_note['effect_value'] = note['timing_sec']
                    self.live_notes.append(end_note)
            # sort by key 'timing_sec'
            self.live_notes = sorted(self.live_notes, key=lambda d: d['timing_sec'])
            self.live_notes_count_slider_twice = len(self.live_notes)
            self.live_length = self.live_notes[-1]['timing_sec']

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
    def calculate_expected_score(self, perfect_rate, max_combo=0, score_up=0, skill_up=0, init_combo=0):
        returns = dict()
        attribute_score = 0
        skill_score = 0

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

        if skill_up:
            for member in members:
                skill_info = member['skill_info']
                if skill_info:
                    if skill_info['skill_effect_type'] == 11:
                        skill_info['activation_rate'] *= 1.1

        basic_score = team_total_attribute * 0.0125
        if score_up:
            basic_score *= 1.1
        star_note_count = 0
        token_note_count = 0
        slider_note_count = 0
        current_combo = init_combo
        total_note_count = 0

        if not max_combo:
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

            result_combo = current_combo
            returns['result_combo'] = result_combo
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
                        # 'trigger_type': 1 indicates time
                        if skill_info['trigger_type'] == 1:
                            skill_expected_score = math.floor(self.live_length / 1000 / skill_info['trigger_value']) * \
                                                   skill_info['activation_rate'] / 100.0 * skill_info['effect_value']

                    skill_score += skill_expected_score

            total_score = attribute_score + skill_score
            total_scoring_up_rate = 0

            # Burst scoring up cards expected scoring bonus (e.g. スコア15000達成ごとに13%の確率でスコアが1120増える)
            for member in members:
                skill_info = member['skill_info']
                if skill_info:
                    if skill_info['skill_effect_type'] == 11:
                        # 'trigger_type': 5 indicates score
                        if skill_info['trigger_type'] == 5:
                            scoring_up_rate = skill_info['effect_value'] / skill_info['trigger_value'] * \
                                              skill_info['activation_rate'] / 100.0
                            total_scoring_up_rate += scoring_up_rate
            total_score /= (1 - total_scoring_up_rate)
            returns['total_score'] = total_score
            returns['slider_note_count'] = slider_note_count
            print('Song: {}\nDifficulty: {}\nTeam total attribute: {}\nTotal expected score: {:.2f}\n'
                  .format(self.live_info['name'], self.live_info['difficulty_text'],
                          returns['team_total_attribute'], returns['total_score']))
            return returns

    def calculate_score_distribution(self):
        func_starting_time = time.time()

        ending_time = self.live_notes[-1]['timing_sec']
        print(ending_time)
        current_time = 0
        next_note_index = 0
        while current_time <= ending_time:
            while self.live_notes[next_note_index]['timing_sec'] == current_time:
                if next_note_index == self.live_notes_count_slider_twice - 1:
                    break
                next_note_index += 1
                print(next_note_index)
            current_time += 1

        func_ending_time = time.time()
        print(func_ending_time - func_starting_time)


if __name__ == '__main__':
    # Create team
    smile_muse = Team(u"../data/team/紅[μ's].sd")
    pure_muse = Team(u"../data/team/緑[μ's].sd")
    t = Team(u"../data/team/s.sd")
    red_guest = [[1, 9], [1, 6, 8]]
    # red_muse.add_guest(red_guest)

    # Create LiveCalculator
    lc = LiveCalculator()
    lc.set_live(234)    # にこぷり♥女子道 EXPERT
    lc.set_live(171)
    lc.set_team(pure_muse)
    lc.calculate_expected_score(0.955, score_up=0, skill_up=0)
    lc.calculate_expected_score(0.955, score_up=1, skill_up=1)
    # lc.calculate_score_distribution()





