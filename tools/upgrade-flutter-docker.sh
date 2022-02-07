#!/bin/bash
set -e
IFS='|'

docker pull cirrusci/flutter:stable
docker build -t anyupp-flutter -f apps/cicd/docker/Dockerfile.flutter .
docker tag anyupp-flutter:latest ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/anyupp-flutter:latest
docker push ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/anyupp-flutter:latest
