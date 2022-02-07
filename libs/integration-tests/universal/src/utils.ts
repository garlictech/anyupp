import { expect } from '@jest/globals';

export const ES_DELAY = 3000; //ms
export const DYNAMO_DELAY = 1000; //ms

export const dateMatcher = {
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};
