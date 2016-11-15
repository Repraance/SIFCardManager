# coding:utf-8

import json
import cv2
import sys
import tkFileDialog
import numpy as np


# 去黑边
def remove_edge(src):
    if src.shape[0:2] == (1080, 1920):
        width_start = 95
        crop = src[0: 1080, width_start: width_start + 1620]
        return crop


# 统计图像中像素之和
def pixel_sum(src):
    px_sum = 0
    width = src.shape[0]
    height = src.shape[1]
    for x in range(0, width):
        for y in range(0, height):
            px_sum += src[y, x][0]
            px_sum += src[y, x][1]
            px_sum += src[y, x][2]
    return px_sum


# 统计图像（灰度）中像素数
def pixel_count(src):
    px_count = 0
    height = src.shape[0]
    width = src.shape[1]
    for x in range(0, height):
        for y in range(0, width):
            if src[x, y][3] > 0:
                px_count += 1
    return px_count


# 获取当前卡截图与模板图像的最小差值
def get_min_diff(src, template, diff_mask):
    offset = [0, 0]
    pixel_sum_min = 100000000
    for offset_i in range(0, 7):
        for offset_j in range(0, 7):
            cropped = src[offset_j: offset_j + template.shape[0], offset_i: offset_i + template.shape[1]]
            diff = cv2.subtract(cropped, template, mask=diff_mask)
            current_pixel_sum = pixel_sum(diff)
            if current_pixel_sum < pixel_sum_min:
                pixel_sum_min = current_pixel_sum
                offset = [offset_j, offset_i]
            print current_pixel_sum
            # cv2.imshow('sd', diff)
            # cv2.waitKey()
    print pixel_sum_min, offset
    cropped = src[offset[0]: offset[0] + template.shape[0], offset[1]: offset[1] + template.shape[1]]
    diff = cv2.subtract(cropped, template, mask=diff_mask)
    cv2.imshow('sd', diff)
    cv2.waitKey()
    return pixel_sum_min


# 创建属性和稀有度的类型索引
def generate_type_index(card_data_json):
    card_data = json.load(file(card_data_json))
    _type_index = dict()
    for card_id in card_data:

        # 检测是否含有键'rarity'和'attribute'
        if 'rarity' and 'attribute' in card_data[card_id]:
            type_name = card_data[card_id]['rarity'] + card_data[card_id]['attribute']

            # 如果没有当前类型的键 将该键创建为dict
            if type_name not in _type_index:
                _type_index[type_name] = dict()
            current_type = _type_index[type_name]

            # 如果没有'card'键 在type_index[type_name]中将其创建为list
            if 'cards' not in current_type:
                current_type['cards'] = list()
            # 将当前卡id添加入list
            current_type['cards'].append(card_id)

            # 添加'pixel_count'键并赋值，只在第一次执行
            if 'pixel_count' not in current_type:
                img = cv2.imread('common/backup/' + type_name + '.png', cv2.IMREAD_UNCHANGED)
                if img is not None:
                    current_type['pixel_count'] = pixel_count(img)
    return _type_index

type_index = generate_type_index('card_data.json')

filename = tkFileDialog.askopenfilename(filetypes=[("image file", ("*.jpg", "*.png"))])
src_img = cv2.imread(filename)
if src_img is None:
    print('Failed to load image file: '+filename)
    sys.exit(1)
crop_img = remove_edge(src_img)
card_width = 192
card_list = crop_img[83: 83 + card_width * 4, 2: 2 + card_width * 8]
ma = None
for i in range(0, 8):
    for j in range(0, 3):
        single_card = card_list[j * card_width: (j + 1) * card_width,
                                i * card_width: (i + 1) * card_width]
        ma = single_card
res = cv2.resize(ma, (135, 135))
tem = cv2.imread('icon/normal/581.png')
face_mask = np.zeros((128, 128, 1), np.uint8)
cv2.circle(face_mask, (63, 63), 55, 255, -1)
get_min_diff(res, tem, face_mask)

result_img_num = 0
min_sum = 100000000
'''
for img_num in range(581, 582):
    tem = cv2.imread('icon/normal/' + str(img_num) + '.png')
    if tem is not None:
        current_sum = get_min_diff(res, tem, face_mask)
        if current_sum < min_sum:
            min_sum = current_sum
            result_img_num = img_num
        print 'Card: ' + str(img_num) + '    pixel sum: ' + str(current_sum)
print result_img_num, min_sum
'''
type_min_sum = 100000000
result_type_name = ''
# for type_name in generate_type_index.type_index:
for i in range(0, 1):
    # type_template = cv2.imread('common/' + type_name + '.png')
    type_template = cv2.imread('common/URpure.png')
    if type_template is not None:
        type_mask = cv2.cvtColor(type_template, cv2.COLOR_BGR2GRAY)
        current_sum = get_min_diff(res, type_template, type_mask)
        if current_sum < type_min_sum:
            type_min_sum = current_sum
            # result_type_name = type_name
print type_min_sum
print result_type_name
# cv2.imshow('ss', ma)
# ta = cv2.imread('icon/normal/' + str(result_img_num) + '.png')
# cv2.imshow('ta', ta)
# cv2.imshow('m', type_mask)
# cv2.waitKey()


