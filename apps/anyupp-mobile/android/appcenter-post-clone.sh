#!/usr/bin/env bash
#Place this script in project/android/app/

cd ..

# fail if any command fails
set -e
# debug log
set -x

curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

cd ..
git clone https://github.com/flutter/flutter.git -b 2.10.5 --depth 1
export PATH=`pwd`/flutter/bin:$PATH

flutter channel stable
flutter doctor

echo "Installed flutter to `pwd`/flutter"

\ARTIFACT_NAME=$(git rev-parse HEAD).tgz
echo "***** Teh build: ${APPCENTER_BRANCH}/${ARTIFACT_NAME}"

aws s3 cp s3://anyupp-build-artifacts-${APPCENTER_BRANCH}/${ARTIFACT_NAME} .
tar -zxf ${ARTIFACT_NAME}

# build APK
# if you get "Execution failed for task ':app:lintVitalRelease'." error, uncomment next two lines
# flutter build apk --debug
# flutter build apk --profile
# flutter build apk --release

# if you need build bundle (AAB) in addition to your APK, uncomment line below and last line of this script.
flutter build appbundle --release --build-number $APPCENTER_BUILD_ID

# copy the APK where AppCenter will find it
cd apps/anyupp-mobile
# mkdir -p android/app/build/outputs/apk/; mv build/app/outputs/flutter-apk/app-release.apk $_
mkdir -p android/app/build/outputs/apk/; mv build/app/outputs/bundle/app-release.aab $_

