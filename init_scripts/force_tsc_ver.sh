#!/bin/bash

repos=( 
  "./../../core/"
  "./../graphics/"
  "./../materials/"
  "./../parsers/"
  "./../player/"
  "./../renderer/"
  "./../scene/"
  "./../stage/"
  "./../view/"
)

ver=$1

echo "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo "Forcing typescript version: '$ver'"
echo "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

for repo in "${repos[@]}"
do
  
  echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>. $repo"
  echo cd "${repo}"
  echo npm install typescript@"$ver"
  echo head -20 ./node_modules/typescript/package.json
  
  cd "${repo}"
  npm install typescript@"$ver"
  head -20 ./node_modules/typescript/package.json
  
done





