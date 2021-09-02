import request from 'supertest';
import { config } from '@bgap/shared/config';

describe('Test the rkeeper api basic functionality', () => {
  test('It should be able to send a POST to the webhook', done => {
    request(config.RKeeperWebhookEndpoint).post('/').expect(200, done);
  });
});
