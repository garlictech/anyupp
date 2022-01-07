#!/bin/bash
set -e

aws configure  set region eu-west-1  
aws configure  set output "json" 
aws configure  set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
aws configure  set aws_access_key_id "$AWS_ACCESS_KEY_ID"

sed -i "s/channel-name/$CHANNEL/" /build/libs/integration-tests/universal/src/lib/report/call-report-generator.spec.ts 
sed -i "s/Acces-key/$AWS_ACCESS_KEY_ID/" /build/libs/integration-tests/universal/src/lib/report/call-report-generator.spec.ts 
sed -i "s#secret-access-key#$AWS_SECRET_ACCESS_KEY#" /build/libs/integration-tests/universal/src/lib/report/call-report-generator.spec.ts 
sed -i "s/userpool/$USERPOOL/" /build/libs/integration-tests/universal/src/lib/report/call-report-generator.spec.ts 

node node_modules/.bin/jest \
libs/integration-tests/universal/src/lib/report/call-report-generator.spec.ts \
-c libs/integration-tests/universal/jest.config.js