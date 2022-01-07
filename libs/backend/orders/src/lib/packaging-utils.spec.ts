import { calculatePackagingFeeOfOrder } from './packaging-utils';

test('Calculate packaging fee when all netPackagingFee-s are given', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixture: any[] = [
    {
      netPackagingFee: 1,
      quantity: 2,
      configSets: [
        {
          items: [
            {
              netPackagingFee: 1,
            },
          ],
        },
      ],
    },
  ];

  expect(calculatePackagingFeeOfOrder(fixture)).toMatchSnapshot();
});

test('Calculate packaging fee when no netPackagingFee-s are given', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixture: any[] = [
    {
      quantity: 2,
      configSets: [
        {
          items: [{}],
        },
      ],
    },
  ];

  expect(calculatePackagingFeeOfOrder(fixture)).toMatchSnapshot();
});

test('Calculate packaging fee when no config set packaging fees are given', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixture: any[] = [
    {
      netPackagingFee: 1,
      quantity: 1,
    },
  ];

  expect(calculatePackagingFeeOfOrder(fixture)).toMatchSnapshot();
});

test('Calculate packaging fee when partial config set packaging fees are given', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixture: any = [
    {
      quantity: 1,
      configSets: [
        {
          items: [
            {},
            {
              netPackagingFee: 1,
            },
          ],
        },
      ],
    },
  ];

  expect(calculatePackagingFeeOfOrder(fixture)).toMatchSnapshot();
});
