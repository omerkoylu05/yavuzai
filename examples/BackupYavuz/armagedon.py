import shutil
import re

# max=0
Points=[]
for i in range(40):
    with open(str(i)+".txt", "r") as file:
        first_line = file.readline().strip()
        match = first_line[4:]
        Points.append(int(match))
        # if match:
        #     point = int(match)
        #     # print(point)
        #     if (point>firstPoint):
        #         firstPoint=point
        #         max=i
        # else:
        # point = None
print(Points)
PointsTemp=[p for p in Points]
index1=Points.index(max(PointsTemp))
PointsTemp.pop(PointsTemp.index(max(PointsTemp)))
index2=Points.index(max(PointsTemp))
PointsTemp.pop(PointsTemp.index(max(PointsTemp)))
index3=Points.index(max(PointsTemp))
PointsTemp.pop(PointsTemp.index(max(PointsTemp)))


print(index1,index2,index3)


source_file = str(index1)+".txt"
f=open(source_file,"r")
first=f.readlines()
f.close()
source_file = str(index2)+".txt"
f=open(source_file,"r")
second=f.readlines()
f.close()
source_file = str(index3)+".txt"
f=open(source_file,"r")
third=f.readlines()
f.close()

destination_folder = "./"

for i in range(10):
    destination_file = f"{i}.txt"
    f=open(destination_folder+destination_file,"w")
    f.writelines(first)
    f.close()



for i in range(15):
    destination_file = f"{i+10}.txt"
    f=open(destination_folder+destination_file,"w")
    f.writelines(second)
    f.close()

for i in range(15):
    destination_file = f"{i+10+15}.txt"
    f=open(destination_folder+destination_file,"w")
    f.writelines(third)
    f.close()