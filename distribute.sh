#!/bin/bash

echo "Distributing the executables to the dist-folder"
echo "Debian ..."
mkdir -p dist/deb
cp out/make/deb/x64/* dist/deb/
echo "Flatpak ..."
mkdir -p dist/flatpak/
cp out/make/flatpak/x86_64/* dist/flatpak/
