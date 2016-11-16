# coding=utf-8

from cv2 import *
import matplotlib.pyplot as plt

n = imread('../assets/symbol/N.png', 0)
r = imread('../assets/symbol/R.png', 0)
sr = imread('../assets/symbol/SR.png', 0)
ssr = imread('../assets/symbol/SSR.png', 0)
ur = imread('../assets/symbol/UR.png', 0)
imshow('n', n)
imshow('r', r)
imshow('sr', sr)
imshow('ssr', ssr)
imshow('ur', ur)
waitKey()
