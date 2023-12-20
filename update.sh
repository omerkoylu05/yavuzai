#!/bin/bash

now=$(date)
git add .
git commit -m "$now"  
git push origin master
