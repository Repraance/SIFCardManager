# coding=utf-8

from cv2 import *
import matplotlib.pyplot as plt

n = imread('common/tem/SRall.png', 0)
rectangle(n, (6, 9), (27, 26), 0, -1)
rectangle(n, (0, 0), (2, 36), 0, -1)
rectangle(n, (0, 0), (33, 4), 0, -1)
rectangle(n, (30, 0), (33, 33), 0, -1)
rectangle(n, (0, 32), (32, 36), 0, -1)
imwrite('11.png', n)
imshow('n', n)
waitKey()
