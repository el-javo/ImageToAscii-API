# coding=utf-8
import numpy as np
import matplotlib.pyplot as plt
import cv2 as cv
from PIL import Image, ImageEnhance
import sys
import os

prevwd = os.path.abspath(os.getcwd())
thisPath = os.path.dirname(os.path.abspath(__file__))

os.chdir(thisPath)

def porcentajeNegro(imgs, invert = False):
    img = cv.imread(imgs)
    blk = 0
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            blk = blk + img[i][j][0]
    pct = blk/(img.shape[0]*img.shape[1]*255)
    if invert:
        return pct
    else:
        return 1 - pct

#Selector caracter
def charSelektor(pincel, pixel):
    dist = 256
    i = 0
    while ( i < pincel.shape[1]) and (abs(pixel - float(pincel[0][i])) <= dist ):
        dist = pixel - float(pincel[0][i])
        i = i + 1
        
    if i == pincel.shape[1]-1:
        if (pixel-float(pincel[0][i])) <= (pixel- float(pincel[0][i-1])):
            return pincel[1][i]
            
    return pincel[1][i-1]


def getStringLines(img, pincel):
  typo = '|S'+str(img.shape[1])
  lines = np.empty(img.shape[0], dtype=typo)
  for i in range(0,img.shape[0]):
    aux = np.chararray(img.shape[1])
    for j in range(0,img.shape[1]):
      aux[j] = pincel[img[i][j]]
    string = ''
    for char in aux:
      string = string + str(char)
    lines[i] = str(string)
  return lines


def img2Ascii(imgstr, pathout, pincel, res, contrast = 1):
  img = cv.imread(prevwd + '/'+ imgstr)
  imgr = cv.resize(img,(int(img.shape[1] * res*2), int(img.shape[0] * res)), interpolation = cv.INTER_AREA)
  imagen = cv.cvtColor(imgr, cv.COLOR_BGR2GRAY)
  if(contrast != 1):
      im = Image.fromarray(imagen)
      enh = ImageEnhance.Contrast(im)
      im = enh.enhance(contrast)
      imagen = np.array(im)
  tot = imagen.shape[0]
  with open(prevwd + '/'+pathout, "w") as file:
    for i in range(0,imagen.shape[0]):
      for j in range(0,imagen.shape[1]):
        file.write(str(pincel[imagen[i][j]]))
      file.write('\n')
    file.close()
  print("100%")
  plt.imshow(imagen, cmap="gray")

def getPincelSimple(pincel):
  pincelS = []
  for i in range(0,256):
    pincelS.append(charSelektor(pincel, i))

  return pincelS

#Esta funcion nos permitirá obtener nuestro pincel y definir su escritura (negativa o no)
# basicamente es un conglomerado del analisis de los caracteres hecho anteriormente (notebook)
# Esta optimizado para devolver unicamente un array de 256 pos que serían el valor de los pixels con el caracter correspondiente
def getPincelOp(invert = False):
    blkP =[]
    number = []
    for x in range(61,145):
        blkP.append(porcentajeNegro('fonts/'+str(x)+'.jpg', invert))

    norm = []
    for x in blkP:
        aux = x - min(blkP)
        aux = aux / (max(blkP) - min(blkP))
        aux = aux * 255
        norm.append(aux)

    chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','r','s','t','u','v','w','x','y','z','{','|','}','~','!','"','#','$','%','&','(','*','+','.','/','1','2','3','4','5','6','7','8','9','@',';',':','>','?','A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z']      
    pincel = np.vstack((norm,chars))
    norm = np.array(norm)
    pincel[0]=pincel[0][norm.argsort()]
    pincel[1]=pincel[1][norm.argsort()]
    pincel = getPincelSimple(pincel)
    return pincel

#obtenemos los argumentos de entrada
pathin = sys.argv[1]
pathout = sys.argv[2]
resolution = float(sys.argv[3])
contrast = float(sys.argv[4])
invert = sys.argv[5] == 'true'

#el parametro invert crea un pincel con los colores invertidos,
#si usas un visor de texto con fondo blanco usa invert = True, sino False
pincel= getPincelOp(invert)
#parametros:
# imagen a renderizar,
#pincel, 
#ratio de compresion: complejidad(On^2), cuidado
#contraste: <1 = menos contraste, >1 = mayor contraste. Es un parametro interesante para la calidad del resultado
img2Ascii(pathin, pathout, pincel, resolution, contrast)

os.chdir(prevwd)
