import { mailtrapBox } from '../../support/mailtrap';
import { When } from 'cypress-cucumber-preprocessor/steps';

const mtBox = mailtrapBox();

When('I delete all messages from the mailtrap inbox', async () => {
  await mtBox.inbox.deleteMessages();
});

When('I wait for the message', async () => {
  await mtBox.inbox.waitForMessages(messages => messages.length > 0);
});

When('I read and type the temporary password from the email', async () => {
  const messages = await mtBox.inbox.getMessages();
  const msgID = messages[0]?.id;

  if (msgID) {
    const txt = await mtBox.client.getMessageBody(
      mtBox.inbox.ID,
      msgID,
      'html',
    );
    // Get the last word from the body "The verification code to your new account is 580684"
    //console.error('TXT???', txt);
    const tempPassword = txt
      .match(/<strong>(.*?)<\/strong>/g)?.[0]
      ?.replace(/<[^>]*>?/gm, '');

    cy.get('#password').last().type(tempPassword);
  }
});

When('I read and type the verification code from the email', async () => {
  const messages = await mtBox.inbox.getMessages();
  const msgID = messages[0]?.id;

  if (msgID) {
    const txt = await mtBox.client.getMessageBody(
      mtBox.inbox.ID,
      msgID,
      'html',
    );
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

When('I click to the change password button', async () => {
  cy.get(
    'amplify-button[data-test="form-section-form-section-button"]',
  ).click();
});

When('I type the new password to the password input', async () => {
  cy.get('input[data-test="require-new-password-password-input"]').type(
    'HarmasHatarHegy12_',
  );
});
