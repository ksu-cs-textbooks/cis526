#!/bin/bash

git pull --recurse-submodules
rm -rf public
hugo
rsync -az public/ nhbean@cslinux.cs.ksu.edu:public_html/cis526
exit 0
