# coding:utf-8

import os
import sys
from flask import Flask, request, render_template
from card_manager.team import Team

app = Flask(__name__, static_folder='.', static_url_path='')


@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/a')
def a():
    lc = live_calculator.LiveCalculator()
    smile_muse = team.Team(u"../data/team/紅[μ's].sd")
    lc.set_live(64)
    lc.set_team(smile_muse)
    return str(lc.calculate_expected_score(0.9, score_up=0, skill_up=0)['team_total_attribute'])


@app.route('/post', methods=['POST'])
def post():
    data = request.get_json()
    d = request.get_data()
    print(data)

    print(d)
    return '哈哈哈'

if __name__ == '__main__':
    app.run(port=8886, debug=True)
