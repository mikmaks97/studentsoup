#!/bin/bash

static="find . -type d -name 'static'"
templates="find . -type d -name 'templates'"

for i in $(eval $static); do
    if [ $i != "./static" ]
    then
        folder="${i}/"
        eval "rsync -a $folder ./static/"
    fi
done

for i in $(eval $templates); do
    if [ $i != "./templates" ]
    then
        folder="${i}/"
        eval "rsync -a $folder ./templates/"
    fi
done

eval "nodemon server.js"
