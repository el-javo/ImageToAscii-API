# coding=utf-8
from PIL import Image, ImageDraw, ImageFont
import os
import sys

prevwd = os.path.abspath(os.getcwd())
thisPath = os.path.dirname(os.path.abspath(__file__))

os.chdir(thisPath)

# decided to avoid the resolution param bc adjusting the font size would be a mess
def asciiToImg(txt_path, out_path, background_color = (255,255,255), font_color = (0,0,0), font_path = 'consola'):
    path = os.getcwd()
    file = open(prevwd +'/'+ txt_path).read()

    charW = len(file.splitlines()[0])
    charH = len(file.splitlines())
    ratioCW = 17
    ratioCH = 34

    blankImg = Image.new('RGB',(charW*ratioCW,charH*ratioCH), background_color)
    font = ImageFont.truetype('consola', 30)
    draw = ImageDraw.Draw(blankImg)

    for line,i in zip(file.splitlines(),range(0,len(file.splitlines()))):
        draw.text((0, (ratioCH)*i),line, font_color, font = font)
    blankImg.save(prevwd + '/'+out_path) 


inPath = sys.argv[1]
outPath = sys.argv[2]
bgcolor = (int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]))
fcolor = (int(sys.argv[6]), int(sys.argv[7]), int(sys.argv[8]))



asciiToImg(inPath,outPath,bgcolor,fcolor)

os.chdir(prevwd)