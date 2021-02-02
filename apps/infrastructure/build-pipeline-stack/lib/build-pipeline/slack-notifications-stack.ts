import * as chatbot from '@aws-cdk/aws-chatbot';
import * as sst from '@serverless-stack/resources';
import * as sns from '@aws-cdk/aws-sns';

export class SlackNotificationsStack extends sst.Stack {
  public slackChannelSns: sns.ITopic;

  constructor(app: sst.App, id: string) {
    super(app, id);

    this.slackChannelSns = new sns.Topic(this, 'SlackNotificationTopic');

    new chatbot.SlackChannelConfiguration(
      this,
      'PR build Slack notification channel',
      {
        slackChannelId: 'cicd',
        slackWorkspaceId: 'T2GE2HF7H',
        slackChannelConfigurationName: 'AnyuppPRBuild',
        notificationTopics: [this.slackChannelSns]
      }
    );
  }
}
