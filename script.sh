#!/bin/bash

set -e

if [ -d "db/db" ]; then
  cd db/db
  npm install
else
  echo "Directory db/db does not exist."
  exit 1
fi

cd ../../app
npm install

cd ../
docker-compose up --build