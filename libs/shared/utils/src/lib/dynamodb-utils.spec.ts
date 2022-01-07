import { createUpdateParams } from './dynamodb-utils';

describe('Test dynamodb utils', () => {
  test('createUpdateParams tests', () => {
    const fixture = {
      prop1: 'prop1',
      prop2: 2,
      prop3: true,
      prop4: {
        embeddedProp: 'embeddedProp',
      },
    };

    expect(
      createUpdateParams('tablename', 'THE_KEY', fixture),
    ).toMatchSnapshot();
  });
});
