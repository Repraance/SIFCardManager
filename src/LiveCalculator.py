# coding:utf-8

import json


class LiveCalculator:
    def __init__(self):
        self.live_info = None
        self.live_notes = None
        with open(u'../assets/maps/maps.json') as fp:
            self.all_lives_info = json.load(fp)
        if self.all_lives_info:
            print 'Live info loaded.'

    def set_team(self):
        pass

    def set_live(self, live_id):
        for live_info in self.all_lives_info:
            if live_info['live_setting_id'] == live_id:
                self.live_info = live_info
                notes_json = live_info['notes_setting_asset']
                with open(u'../assets/maps/latest/' + notes_json) as fp:
                    self.live_notes = json.load(fp)

    def calculate_team_strength(self):
        pass

    def calculate_score(self):
        pass

    def calculate_timing_coverage(self):
        pass

    def calculate(self):
        pass


if __name__ == '__main__':
    lc = LiveCalculator()
    lc.set_live(397)
    print lc.live_info
    print lc.live_notes

