#!/bin/bash
set -e

time ./tools/install-nodejs-14.sh &
nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375 --storage-driver=overlay2 &
timeout 15 sh -c "until docker info; do echo .; sleep 1; done"
docker pull cirrusci/flutter &
chmod +x ./tools/*.sh
./tools/setup-aws-environment.sh &
time npm install -g @aws-amplify/cli cowsay &
time yarn --frozen-lockfile &
npx cowsay "STARTING PR CHECK"
