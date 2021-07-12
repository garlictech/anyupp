import { Client, Inbox } from 'mailtrap';

//import { config } from '@bgap/shared/config';

const config = {
  MailtrapApiKey: 'dssddsds',
};

export const mailtrapBox = () => {
  const client = new Client({
    apiToken: config.MailtrapApiKey,
  });
  const inbox = new Inbox(client, 'Dev');

  return { client, inbox };
};
