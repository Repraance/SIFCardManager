# coding:utf-8

from __future__ import absolute_import
from __future__ import print_function
import os
import json
import tkFileDialog
import cv2
import numpy as np
from collections import defaultdict


class Matcher:
    def __init__(self):
        self.card_width = 131
        self.raw_screen_shot = list()
        self.card_icon = list()
        self.card_type = list()
        self.card_rarity = list()
        self.card_attr = list()
        self.type_index = defaultdict(list)
        self.attr_index = ['cool', 'pure', 'smile']
        self.rarity_index = ['N', 'R', 'SR', 'SSR', 'UR']
        self.rarity_symbol_pixel_count_index = dict.fromkeys(self.rarity_index)

    # 使用tk打开截图图像文件
    def input_screen_shot(self):
        filename = tkFileDialog.askopenfilenames(filetypes=[("image file", ("*.jpg", "*.png"))])
        for every_filename in filename:
            raw_screen_shot_img = cv2.imread(every_filename)
            if raw_screen_shot_img is not None:
                screen_shot_img = self.remove_edge(raw_screen_shot_img)
                self.raw_screen_shot.append(raw_screen_shot_img)

    def show_raw_screen_shot(self):
        for e in self.raw_screen_shot:
            cv2.imshow('ss', e)
            cv2.waitKey()

    # 去黑边
    @classmethod
    def remove_edge(cls, src):
        if src.shape[0:2] == (1080, 1920):
            width_start = 95
            cropped_src = src[0: 1080, width_start: width_start + 1620]
            resized_src = cv2.resize(cropped_src, (1134, 756))
            return resized_src

    # 统计图像中像素之和
    @classmethod
    def pixel_sum(cls, src):
        px_sum = 0
        width = src.shape[0]
        height = src.shape[1]
        if src.ndim == 3:
            for y in range(0, width):
                for x in range(0, height):
                    px_sum += src[y, x][0]
                    px_sum += src[y, x][1]
                    px_sum += src[y, x][2]

        if src.ndim == 2:
            for y in range(0, width):
                for x in range(0, height):
                    px_sum += src[y, x]
        return px_sum

    # 统计图像（灰度）中像素数
    @classmethod
    def pixel_count(cls, src):
        px_count = 0
        height = src.shape[0]
        width = src.shape[1]
        for y in range(0, height):
            for x in range(0, width):
                if src[y, x] > 0:
                    px_count += 1
        return px_count

    # 获取当前卡截图与模板图像的最小差值
    def get_min_diff(self, src, template, global_offset=(0, 0), mask=None, display=False):
        diff_mask = template
        if mask is None:
            if template.ndim == 3:
                diff_mask = cv2.cvtColor(diff_mask, cv2.COLOR_BGR2GRAY)
        else:
            diff_mask = mask
        offset = [0, 0]
        pixel_sum_min = 100000000
        for offset_i in range(0, 3):
            for offset_j in range(0, 3):
                cropped = src[offset_j + global_offset[0]: offset_j + global_offset[0] + template.shape[0],
                              offset_i + global_offset[1]: offset_i + global_offset[1] + template.shape[1]]
                # diff = cv2.subtract(template, cropped, mask=diff_mask)
                diff = cv2.absdiff(template, cropped)
                current_pixel_sum = self.pixel_sum(diff)
                if current_pixel_sum < pixel_sum_min:
                    pixel_sum_min = current_pixel_sum
                    offset = [offset_j, offset_i]
        # print pixel_sum_min, offset
        if display:
            cropped = src[offset[0] + global_offset[0]: offset[0] + global_offset[0] + template.shape[0],
                          offset[1] + global_offset[1]: offset[1] + global_offset[1] + template.shape[1]]
            diff = cv2.subtract(template, cropped, mask=diff_mask)
            cv2.imshow('tem', template)
            cv2.imshow('sd', diff)
            cv2.waitKey()
        return pixel_sum_min

    # 创建属性和稀有度的类型索引
    def generate_type_index(self, card_data_json='../data/card_data.json'):
        card_data = json.load(open(card_data_json))
        for card_id in card_data:
            # 检测是否含有键'rarity'和'attribute'
            if 'rarity' and 'attribute' in card_data[card_id]:
                type_name = card_data[card_id]['rarity'] + card_data[card_id]['attribute']
                self.type_index[type_name].append(card_id)

    # 因为稀有度标志图像大小不一 需要为其创建像素数索引
    def generate_rarity_symbol_pixel_count_index(self):
        for rarity_name in self.rarity_symbol_pixel_count_index:
            img = cv2.imread('../assets/symbol/' + rarity_name + '.png', 0)
            if img is not None:
                cropped = img[0: 37, 0: 40]
                self.rarity_symbol_pixel_count_index[rarity_name] = self.pixel_count(cropped)

    # 将截图分成单独的卡，存储在 card_icon 中
    def split(self):
        card_list = self.remove_edge(self.raw_screen_shot[0])
        col_start = [3, 137, 272, 407, 541, 676, 811, 945]
        row_start = [60, 194, 329, 463]
        for i in range(0, 8):
            for j in range(0, 4):
                single_card = card_list[row_start[j]: row_start[j] + self.card_width,
                                        col_start[i]: col_start[i] + self.card_width]
                self.card_icon.append(single_card)
                card_rankup = self.detect_rankup(single_card)
                card_attr = self.detect_attr(single_card)
                card_rarity = self.detect_rarity(single_card)
                card_type = card_rarity + card_attr
                self.match(single_card, card_type, card_rankup)

    def prepare_data(self):
        self.generate_type_index()
        self.generate_rarity_symbol_pixel_count_index()

    @staticmethod
    def get_max_value_index(l):
        max_value = 0
        max_value_index = 0
        for i in range(0, len(l)):
            if l[i] > max_value:
                max_value = l[i]
                max_value_index = i
        return max_value_index

    # 检测卡的属性（颜色）
    def detect_attr(self, card):
        color = list()
        color_count = list()
        for i in range(15, 19):
            pixel_val = card[100, i]
            color.append(self.get_max_value_index(pixel_val))
        for i in range(0, 3):
            color_count.append(color.count(i))
        attr = self.attr_index[self.get_max_value_index(color_count)]
        return attr

    # 检测卡的稀有度
    def detect_rarity(self, card):
        card_gray = cv2.cvtColor(card, cv2.COLOR_BGR2GRAY)
        min_average_pixel_sum = 100000000
        result_rarity_name = ''
        for rarity_name in self.rarity_index:
            template_raw = cv2.imread('../assets/symbol/' + rarity_name + '.png', 0)
            if template_raw is not None:
                template = template_raw[0: 40, 0: 43]
                pixel_count = self.rarity_symbol_pixel_count_index[rarity_name]
                current_average_pixel_sum = self.get_min_diff(card_gray, template, display=False) / pixel_count
                # print type_name, current_average_pixel_sum
                if current_average_pixel_sum < min_average_pixel_sum:
                    min_average_pixel_sum = current_average_pixel_sum
                    result_rarity_name = rarity_name
        return result_rarity_name

    def detect_type(self):
        self.detect_rarity()
        self.detect_attr()
        card_count = len(self.card_icon)
        for i in range(0, card_count):
            self.card_type.append(self.card_rarity[i] + self.card_attr[i])

    def detect_rankup(self, card):
        pixel_val = card[35, 5]
        if pixel_val[0] < 100 and pixel_val[1] > 200 and pixel_val[2] > 200:
            return True
        else:
            return False

    def match(self, card, card_type, rankup):
        card_gray = cv2.cvtColor(card, cv2.COLOR_BGR2GRAY)
        face_mask = np.zeros((128, 128, 1), np.uint8)
        cv2.circle(face_mask, (63, 63), 50, 255, -1)
        min_pixel_sum = 100000000
        result_card_id = 0
        path_prefix = ''
        for card_id in self.type_index[card_type]:
            if rankup:
                path_prefix = '../assets/icon/rankup/'
            else:
                path_prefix = '../assets/icon/normal/'
            template = cv2.imread(path_prefix + card_id + '.png', 0)
            if template is not None:
                current_pixel_sum = self.get_min_diff(card_gray, template, mask=face_mask, display=False)
                if current_pixel_sum < min_pixel_sum:
                    min_pixel_sum = current_pixel_sum
                    result_card_id = card_id
                print(current_pixel_sum)
        print(result_card_id)
        result_card = cv2.imread(path_prefix + result_card_id + '.png')
        cv2.imshow('re', result_card)
        cv2.waitKey()


if __name__ == '__main__':
    os.chdir('../test')
    matcher = Matcher()
    matcher.prepare_data()
    matcher.input_screen_shot()
    matcher.split()
