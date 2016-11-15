# coding=utf-8
import math
import json


class SimpleUnit:
    def import_unit(self, unit_json):
        unit_info = json.load(file(unit_json))
        smile_unit_info = unit_info['smile']
        pure_unit_info = unit_info['pure']
        cool_unit_info = unit_info['cool']

    def import_song(self, song_json):
        song_info = json.load(file(song_json))


# 计算属性分数
def calc_attr_score(unit_attr, combo, perfect_rate, slider_rate, custom_combo_factor=0.0):
    basic_score = unit_attr * 0.0125  # 每个note的基本分数
    if custom_combo_factor == 0.0:
        combo_factor = get_combo_factor(combo)  # combo系数
    else:
        combo_factor = custom_combo_factor
    song_factor = 1.1  # 歌曲属性系数
    character_factor = 1.1  # 角色系数
    slider_count = combo * slider_rate  # 滑条数目
    slider_score_factor = perfect_rate ** 2 * 1.00 + \
                          perfect_rate * (1 - perfect_rate) * 2 * 0.88 + (1 - perfect_rate) ** 2 * 0.7744
    perfect_factor = 1 * perfect_rate + 0.88 * (1 - perfect_rate)
    total_score = (basic_score * (combo - slider_count) * perfect_factor + 1.25 * basic_score * slider_count *
                   slider_score_factor) * song_factor * character_factor * combo_factor
    return total_score


# 计算combo系数
# FC
def get_combo_factor(combo):
    if 1 <= combo <= 50:
        return 1.00
    elif combo <= 100:
        return (1.10 * (combo - 50) + get_combo_factor(50) * 50) / combo
    elif combo <= 200:
        return (1.15 * (combo - 100) + get_combo_factor(100) * 100) / combo
    elif combo <= 400:
        return (1.20 * (combo - 200) + get_combo_factor(200) * 200) / combo
    elif combo <= 600:
        return (1.25 * (combo - 400) + get_combo_factor(400) * 400) / combo
    elif combo <= 800:
        return (1.30 * (combo - 600) + get_combo_factor(600) * 600) / combo
    else:
        return (1.35 * (combo - 800) + get_combo_factor(800) * 800) / combo


# 未FC
def get_total_combo_factor(total_combo, max_combo):
    break_count = math.floor(total_combo / max_combo)




# 计算加分技能所增加的分数
def calc_skill_score(skill, combo, perfect_rate):
    total_score = 0
    for ele in skill:
        score = 0
        if ele[3] == 'combo':
            score = combo / ele[0] * ele[1] * ele[2] / 100
        elif ele[3] == 'perfect':
            score = combo * perfect_rate / ele[0] * ele[1] * ele[2] / 100
        elif ele[3] == 'icon':
            score = combo / ele[0] * ele[1] * ele[2] / 100
        total_score += score
    return total_score


# 计算总分
def calc_total_score(unit, combo, perfect_rate, slider_rate, is_tap_up, is_score_up, custom_combo_factor=0.0):
    attr_score = calc_attr_score(unit['unit_attribute'], combo, perfect_rate, slider_rate, custom_combo_factor)
    skill_score = calc_skill_score(unit['skill_detail'], combo, perfect_rate)
    if is_tap_up:
        attr_score *= 1.1
    if is_score_up:
        skill_score *= 1.1
    return attr_score + skill_score

smile_skill = [[17, 50, 400, 'combo'],
               [28, 34, 800, 'perfect'],
               [17, 24, 665, 'perfect'],
               [15, 36, 400, 'perfect']]
unit_smile = [74013, smile_skill]

cool_skill = [[21, 24, 450, 'note'],
              [24, 30, 460, 'note'],
              [30, 36, 780, 'note'],
              [17, 31, 505, 'note'],
              [15, 50, 400, 'perfect'],
              [24, 30, 460, 'note'],
              [18, 28, 490, 'perfect']]

unit_cool = [64613, cool_skill]
unit_info = json.load(file('unit_conf.json'))

print 'NO EXIT ORION'
print calc_total_score(unit_info['cool'], 581, 0.84, 0.057, 1, 1)
print ' '

print 'HEART to HEART!'
print calc_total_score(unit_info['smile'], 581, 0.9, 0.084, 1, 1)
print ' '

print 'Mermaid festa vol.2〜Passionate〜'
print calc_total_score(unit_info['smile'], 584, 0.9, 0.111, 1, 1)
print ' '

