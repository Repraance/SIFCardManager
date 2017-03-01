# coding:utf-8

from flask import Flask, request, render_template
from card_manager.team import Team

app = Flask(__name__, static_folder='.', static_url_path='')


@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(port=8886, debug=True)
