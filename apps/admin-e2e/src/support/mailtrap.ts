import { Client, Inbox } from 'mailtrap';

const config = {
  MailtrapApiKey: '646cceec28fd28c1ed832b13e48ad2d1',
};

export const mailtrapBox = () => {
  const client = new Client({
    apiToken: config.MailtrapApiKey,
  });
  const inbox = new Inbox(client, 'Dev');

  return { client, inbox };
};
