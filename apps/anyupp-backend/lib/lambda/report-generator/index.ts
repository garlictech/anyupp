import { createReport } from '@bgap/anyupp-backend-lib';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';

const reportDate = new Date().toISOString().substr(0, 10);

const deps = {
  region: process.env.AWS_REGION || '',
  userPoolId: process.env.USER_POOL_ID || '',
  crudSdk: getCrudSdkForIAM(
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
  ),
  reportFile: `./weeklyReport-${reportDate}.xlsx`,
  reportDate,
  slackBotToken: process.env.SLACK_BOT_TOKEN || '',
  slackChannel: process.env.SLACK_CHANNEL || '',
};

createReport(deps).subscribe();
