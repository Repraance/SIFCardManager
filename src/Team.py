# coding:utf-8

import json


class Team:
    def __init__(self, team_json=None):
        self.members = list()
        self.members_position = list()
        self.school_idol_skills = list()
        self.center_member = None
        self.center_skill = None

        if team_json is not None:
            with open(team_json) as fp:
                raw_team_json = json.load(fp)
                for card in raw_team_json:
                    self.members.append(card)

    def set_team_from_json(self, team_json):
        with open(team_json) as fp:
            raw_team_json = json.load(fp)
            for card in raw_team_json:
                self.members.append(card)

    def set_members(self):
        pass

    def set_school_idol_skills(self):
        pass

    def set_members_position(self):
        pass

    def show_team_details(self):
        pass


if __name__ == '__main__':
    red_aqours = Team(u"../data/紅[μ's].sd")
    for i in red_aqours.members:
        print i
