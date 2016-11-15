# coding:utf-8

import json
import cv2
import sys
import tkFileDialog
import numpy as np


class Matcher:
    def __init__(self):
        self.card_width = 131
        self.raw_screen_shot = list()
        self.card_icon = list()
        self.card_type = list()
        self.type_index = dict()
        self.attr_index = ['cool', 'pure', 'smile']

    # 使用tk打开截图图像文件
    def input_screen_shot(self):
        filename = tkFileDialog.askopenfilenames(filetypes=[("image file", ("*.jpg", "*.png"))])
        for every_filename in filename:
            raw_screen_shot_img = cv2.imread(every_filename)
            if raw_screen_shot_img is not None:
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
        for y in range(0, width):
            for x in range(0, height):
                if src.ndim == 3:
                    px_sum += src[y, x][0]
                    px_sum += src[y, x][1]
                    px_sum += src[y, x][2]
                if src.ndim == 2:
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
    def get_min_diff(self, src, template, global_offset=(0, 0)):
        diff_mask = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
        offset = [0, 0]
        pixel_sum_min = 100000000
        for offset_i in range(0, 4):
            for offset_j in range(0, 4):
                cropped = src[offset_j + global_offset[0]: offset_j + global_offset[0] + template.shape[0],
                              offset_i + global_offset[1]: offset_i + global_offset[1] + template.shape[1]]
                diff = cv2.subtract(template, cropped, mask=diff_mask)
                current_pixel_sum = self.pixel_sum(diff)
                if current_pixel_sum < pixel_sum_min:
                    pixel_sum_min = current_pixel_sum
                    offset = [offset_j, offset_i]
        # print pixel_sum_min, offset
        cropped = src[offset[0]: offset[0] + template.shape[0], offset[1]: offset[1] + template.shape[1]]
        diff = cv2.subtract(cropped, template, mask=diff_mask)
        # cv2.imshow('sd', diff)
        # cv2.waitKey()
        return pixel_sum_min

    # 创建属性和稀有度的类型索引
    def generate_type_index(self, card_data_json):
        card_data = json.load(file(card_data_json))
        for card_id in card_data:
            # 检测是否含有键'rarity'和'attribute'
            if 'rarity' and 'attribute' in card_data[card_id]:
                type_name = card_data[card_id]['rarity'] + card_data[card_id]['attribute']

                # 如果没有当前类型的键 将该键创建为dict
                if type_name not in self.type_index:
                    self.type_index[type_name] = dict()
                current_type = self.type_index[type_name]

                # 如果没有'card'键 在type_index[type_name]中将其创建为list
                if 'cards' not in current_type:
                    current_type['cards'] = list()
                # 将当前卡id添加入list
                current_type['cards'].append(card_id)

                # 添加'pixel_count'键并赋值，只在第一次执行
                if 'pixel_count' not in current_type:
                    img = cv2.imread('common/' + type_name + '.png', 0)
                    if img is not None:
                        cropped = img[0: 37, 0: 25]
                        current_type['pixel_count'] = self.pixel_count(cropped)

    # 将截图分成单独的卡，存储在card_icon中
    def split(self):
        card_list = self.remove_edge(self.raw_screen_shot[0])
        col_start = [3, 137, 272, 407, 541, 676, 811, 945]
        row_start = [60, 194, 329, 463]
        for i in range(0, 8):
            for j in range(0, 4):
                single_card = card_list[row_start[j]: row_start[j] + self.card_width,
                                        col_start[i]: col_start[i] + self.card_width]
                self.card_icon.append(single_card)

    @staticmethod
    def get_max_value_index(l):
        max_value = 0
        max_value_index = 0
        for i in range(0, len(l)):
            if l[i] > max_value:
                max_value = l[i]
                max_value_index = i
        return max_value_index

    def detect_attr(self):
        for card in self.card_icon:
            color = list()
            color_count = list()
            for i in range(15, 19):
                pixel_val = card[100, i]
                color.append(self.get_max_value_index(pixel_val))
            for i in range(0, 3):
                color_count.append(color.count(i))
            attr = self.attr_index[self.get_max_value_index(color_count)]
            print attr

    def detect_rarity(self):
        card = self.card_icon[1]
        card_gray = cv2.cvtColor(card, cv2.COLOR_BGR2GRAY)
        card_cropped = card_gray[1:129, 1:129]
        rarity = ['N', 'R', 'SR', 'SSR', 'UR']
        for rr in rarity:
            tem = cv2.imread('common/tem/' + rr + 'all.png', 0)
            diff = cv2.subtract(tem, card_cropped, mask=tem)
            print rr, self.pixel_sum(diff)
            cv2.imshow('card', card_cropped)
            cv2.imshow('rr', tem)
            cv2.imshow('diff', diff)
            cv2.waitKey()

    def detect_type(self):
        for card in self.card_icon:
            min_average_pixel_sum = 100000000
            result_type_name = ''
            for type_name in self.type_index:
                template_raw = cv2.imread('common/' + type_name + '.png')
                if template_raw is not None:
                    template = template_raw[0: 37, 0: 25]
                    pixel_count = float(self.type_index[type_name]['pixel_count'])
                    current_average_pixel_sum = self.get_min_diff(card, template) / pixel_count
                    # print type_name, current_average_pixel_sum
                    if current_average_pixel_sum < min_average_pixel_sum:
                        min_average_pixel_sum = current_average_pixel_sum
                        result_type_name = type_name
            self.card_type.append(result_type_name)
            print result_type_name

    def match(self):
        face_mask = np.zeros((128, 128, 1), np.uint8)
        cv2.circle(face_mask, (63, 63), 53, 255, -1)

if __name__ == '__main__':
    matcher = Matcher()
    matcher.input_screen_shot()
    matcher.split()
    matcher.generate_type_index('card_data.json')
    matcher.detect_type()
