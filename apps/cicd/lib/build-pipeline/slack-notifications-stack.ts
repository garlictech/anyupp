import { aws_chatbot as chatbot, aws_sns as sns } from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';

export class SlackNotificationsStack extends sst.Stack {
  public chatbot: chatbot.SlackChannelConfiguration;

  constructor(app: sst.App, id: string) {
    super(app, id);

    const slackChannelSns = new sns.Topic(this, 'SlackNotificationTopic');

    this.chatbot = new chatbot.SlackChannelConfiguration(
      this,
      'Build Slack notification channel',
      {
        slackChannelId: 'cicd',
        slackWorkspaceId: 'T2GE2HF7H',
        slackChannelConfigurationName: 'AnyuppBuild',
        notificationTopics: [slackChannelSns],
      },
    );
  }
}
