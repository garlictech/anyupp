import * as chatbot from '@aws-cdk/aws-chatbot';
import * as sst from '@serverless-stack/resources';
import * as sns from '@aws-cdk/aws-sns';

export class SlackNotificationsStack extends sst.Stack {
  public chatbot: chatbot.SlackChannelConfiguration;

  constructor(app: sst.App, id: string) {
    super(app, id);

    const slackChannelSns = new sns.Topic(this, 'SlackNotificationTopic');

    this.chatbot = new chatbot.SlackChannelConfiguration(
      this,
      'PR build Slack notification channel',
      {
        slackChannelId: 'cicd',
        slackWorkspaceId: 'T2GE2HF7H',
        slackChannelConfigurationName: 'AnyuppPRBuild',
        notificationTopics: [slackChannelSns],
      },
    );
  }
}
