import json
from xml.etree.ElementTree import tostring
from matplotlib import pyplot as plt

input_file = open('./coordinates.json')
json_array = json.load(input_file)

plt.rcParams["figure.autolayout"] = True

plt.xlim(-400, 400)
plt.ylim(-400, 400)
plt.grid()

x = []
y = []

count = 0

for coordinate in json_array:
  x.append(coordinate['x'])
  y.append(coordinate['y'])

  plt.plot(x, y, 'o', markersize=5, markeredgecolor="red", markerfacecolor="green")
  count += 1
  
print(count)
plt.show()

  
