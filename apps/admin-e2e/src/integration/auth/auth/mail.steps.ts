import { When } from 'cypress-cucumber-preprocessor/steps';
import { Client, Inbox } from 'mailtrap';

const MAILTRAP_API_TOKEN = '646cceec28fd28c1ed832b13e48ad2d1';
const client = new Client({
  apiToken: MAILTRAP_API_TOKEN,
});
const inbox = new Inbox(client, 'Dev');

When('I delete all messages from the inbox', async () => {
  await inbox.deleteMessages();
});

When('I wait for the message', async () => {
  await inbox.waitForMessages(messages => messages.length > 0);
});

When('I read and type the verification code from the email', async () => {
  const messages = await inbox.getMessages();
  const msgID = messages[0]?.id;

  if (msgID) {
    const txt = await client.getMessageBody(inbox.ID, msgID, 'html');
    // Get the last word from the body "The verification code to your new account is 580684"
    const code = txt.split(' ').pop();

    cy.get('#code').last().type(code);
    cy.get('#password').last().type('HarmasHatarHegy12_');
  }
});

When('I click to the forgot password button', async () => {
  cy.get(
    'amplify-button[data-test="forgot-password-forgot-password-button"]',
  ).click();
});
