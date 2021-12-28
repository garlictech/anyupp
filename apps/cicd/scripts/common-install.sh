#!/bin/bash
set -e

echo "********************************"
echo "Node version:"
node --version
echo "Yarn version:"
yarn --version
echo "********************************"
nohup /usr/local/bin/dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375 --storage-driver=overlay2 &
timeout 15 sh -c "until docker info; do echo .; sleep 1; done"
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.eu-west-1.amazonaws.com
docker pull ${AWS_ACCOUNT}.dkr.ecr.eu-west-1.amazonaws.com/anyupp-flutter &
chmod +x ./tools/*.sh
./tools/setup-aws-environment.sh 
yarn --frozen-lockfile 
