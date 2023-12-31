#!/bin/sh

read -p "Commit message: " COMMIT_MESSAGE

rm -rf appstate.json; touch appstate.json; git add .; git commit -m $COMMIT_MESSAGE; git push