#!/usr/bin/env bash
#Place this script in project/ios/

# fail if any command fails
set -e
# debug log
set -x

curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

cd ..
git clone https://github.com/flutter/flutter.git -b 2.10.5 --depth 1
export PATH=`pwd`/flutter/bin:$PATH
echo "Installed flutter to `pwd`/flutter"

#flutter channel stable
flutter doctor

ARTIFACT_NAME=$(git rev-parse HEAD).tgz
echo "***** The build: ${APPCENTER_BRANCH}/${ARTIFACT_NAME}"

cd ../..
aws s3 cp s3://anyupp-build-artifacts-${APPCENTER_BRANCH}/${ARTIFACT_NAME} .
tar -zxf ${ARTIFACT_NAME}

cd apps/anyupp-mobile
flutter build ios --release --no-codesign

