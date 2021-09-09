#!/bin/bash
set -e

echo
echo "************************************************************************"
echo "* Executing integration tests in headless mode."
echo "* Use this script in docker/ci environments."
echo "* For the environment, see the" 
echo "* 'apps/cicd/docker/Dockerfile.flutter' file."
echo "************************************************************************"
echo

echo 
echo "************************************************************************"
echo "* Starting the Android emulator..."
echo "************************************************************************"
echo

adb start-server
emulator @int_test -no-audio -no-window -no-accel -no-boot-anim \
    -netdelay none -no-snapshot -skin 768x1280 -gpu off &

echo
echo "************************************************************************"
echo " Checking some stuff..."
echo "************************************************************************"
echo

sleep 10
adb devices
flutter doctor

echo
echo "************************************************************************"
echo " Executing the integration tests..."
echo "************************************************************************"
echo
flutter test ./integration_test/start_app_test.dart --timeout "300s"
