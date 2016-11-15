# coding=utf-8
import math
import json


class SimpleUnit:

    def import_unit(self, unit_json):
        self.unit_info = json.load(file(unit_json))
        self.smile_unit_info = self.unit_info['smile']
        self.pure_unit_info = self.unit_info['pure']
        self.cool_unit_info =self.unit_info['cool']

    # 导入全部歌曲的原始信息
    def import_total_song(self, total_song_json):
        # total_song_info是dict
        total_song_info = {}
        raw_song_info = json.load(file(total_song_json))
        name = []
        for key in raw_song_info:
            name.append(raw_song_info[key].get('jpname'))
        print len(name)
        for keya in raw_song_info:
            if 'expert' in raw_song_info[keya]:
                name.remove(raw_song_info[keya].get('jpname'))
        print len(name)
        print name[0]




            # song_name = raw_song_info[key]['jpname']
            # total_song_info[song_name] = {}
            # this = total_song_info[song_name]
            #
            # time = raw_song_info[key]['totaltime']
            # attribute = raw_song_info[key]['attribute']
            # artist = "μ's" if raw_song_info[key]['muse'] == 1 else 'aqours'
            #
            # this['time'] = time
            # this['attribute'] = attribute
            # this['artist'] = artist
            #
            # this['expert'] = {}
            # this['expert']['combo'] = raw_song_info[key]['expert']['combo']
            # this['expert']['time'] = raw_song_info[key]['expert']['time']
            # this['expert']['star'] = raw_song_info[key]['expert']['star']
            # this['expert']['weight'] = raw_song_info[key]['expert']['positionweight']


    # 导入当前活动曲池
    def import_event_song(self, event_song_json):
        # event_song是list
        self.event_song = json.load(file(event_song_json))['songs']

    # 生成当前活动曲池信息，方便活动期间调用
    def generate_event_song_info(self, song_list):
        self.event_song_pool_info = {}
        song_in_pool = self.event_song_pool_info
        for i in range(1, 489):
            if(str(i)) in self.total_song_info:
                for song in self.event_song:
                    if self.total_song_info[str(i)] == song[0]:
                        self.event_song_pool_info[song[0]] = {}
                        self.event_song_pool_info[song[0]]['combo'] = self.total_song_info[str(i)]


simple_unit = SimpleUnit()
simple_unit.import_total_song('song_data.json')
simple_unit.import_unit('unit_conf.json')
simple_unit.import_event_song('current_event_song.json')
