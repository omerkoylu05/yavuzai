import shutil
import re

max=0
firstPoint=0
for i in range(40):
    with open(str(i)+".txt", "r") as file:
        first_line = file.readline().strip()
        match = first_line[4:]
        if match:
            point = int(match)
            # print(point)
            if (point>firstPoint):
                firstPoint=point
                max=i
        else:
            point = None

source_file = str(max)+".txt"
destination_folder = "./"

for i in range(40):
    if (i!=max):
        destination_file = f"{i}.txt"
        shutil.copy(source_file, destination_folder + destination_file)
