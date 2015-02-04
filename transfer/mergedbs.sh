#!/bin/bash

rm -rf dump

mongodump -d yangcong-prod -c provinces
mongodump -d yangcong-prod -c schools
mongodump -d yangcong-prod -c rooms
mongodump -d yangcong-prod -c users
mongodump -d yangcong-prod -c userdatas
mongodump -d yangcong-prod -c scores
mongodump -d yangcong-prod -c goods

mongodump -d yangcong-math-test -c publishers
mongodump -d yangcong-math-test -c chapters
mongodump -d yangcong-math-test -c topics
mongodump -d yangcong-math-test -c tasks
mongodump -d yangcong-math-test -c activities
mongodump -d yangcong-math-test -c problems
mongodump -d yangcong-math-test -c tags
mongodump -d yangcong-math-test -c videos
mongodump -d yangcong-math-test -c mobile_tracks

mongorestore --drop -d target dump/yangcong-prod
mongorestore --drop -d target dump/yangcong-math-test
rm -rf dump




