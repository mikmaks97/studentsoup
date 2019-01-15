#!/bin/bash
mkdir -p static
mkdir -p templates

static="find . -type d -name 'static'"
templates="find . -type d -name 'templates'"

for i in $(eval $static); do
    if [ $i != "./static" ]
    then
        src=$(eval "echo "$(cd "$(dirname "$i")"; pwd -P)/$(basename "$i")"")
        linkname=$(eval "echo '$i' | cut -d/ -f2")
        dest=$(eval "echo "$(cd "$(dirname "./static")"; pwd -P)/$(basename "./static")"")
        dest="$dest/${linkname}"
        echo "Creating symlink $dest => $src"
        eval "ln -sn $src $dest"
    fi
done

for i in $(eval $templates); do
    if [ $i != "./templates" ]
    then
        src=$(eval "echo "$(cd "$(dirname "$i")"; pwd -P)/$(basename "$i")"")
        linkname=$(eval "echo '$i' | cut -d/ -f2")
        dest=$(eval "echo "$(cd "$(dirname "./templates")"; pwd -P)/$(basename "./templates")"")
        dest="$dest/${linkname}"
        echo "Creating symlink $dest => $src"
        eval "ln -sn $src $dest"
    fi
done
