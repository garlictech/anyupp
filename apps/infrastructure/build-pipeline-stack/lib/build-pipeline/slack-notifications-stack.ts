import * as chatbot from '@aws-cdk/aws-chatbot';
import * as sst from '@serverless-stack/resources';

export type SlackNotificationsStackProps = sst.StackProps;

export class SlackNotificationsStack extends sst.Stack {
  public slackChannel: chatbot.ISlackChannelConfiguration;

  constructor(app: sst.App, id: string, props: SlackNotificationsStackProps) {
    super(app, id, props);

    this.slackChannel = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(
      this,
      'SlackChannelConfiguration',
      'arn:aws:chatbot::568276182587:chat-configuration/slack-channel/anyupp-cicd'
    );
  }
}
