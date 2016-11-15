# coding=utf-8
import json
import urllib2

try:
    data_url = urllib2.urlopen('http://py.loveliv.es/scomat.php')
except urllib2.URLError as error_info:
    print error_info

data = json.loads(data_url.read())
print data[0][0]['user_info']['name']
