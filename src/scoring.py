# coding=utf-8


# 获取当前combo系数
def get_combo_factor(combo):
    if 0 < combo <= 50:
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


# 获取当前判定系数
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


def calc_basic_score(combo_count, slider_count, attr, same_attr, same_unit):
    combo = 1
    while combo <= combo_count:
        combo_factor = get_combo_factor(combo)




