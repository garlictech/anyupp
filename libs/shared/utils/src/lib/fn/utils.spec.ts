import {
  customDateCompare,
  customNumberCompare,
  customStringCompare,
  externalIdArrayCompare,
  zeroFill,
} from './utils';

describe('Custom compare fns', () => {
  it('customNumberCompare', () => {
    const arr = [
      { id: '3', numField: 3 },
      { id: '2', numField: 2 },
      { id: '1', numField: 1 },
    ];
    const sortedArray = [...arr].sort(customNumberCompare('numField', false));
    const sortedArrayDesc = [...arr].sort(
      customNumberCompare('numField', true),
    );

    expect(sortedArray).toMatchSnapshot();
    expect(sortedArrayDesc).toMatchSnapshot();
  });

  it('customDateCompare', () => {
    const arr = [
      { id: '3', dateField: '2022-03-01' },
      { id: '2', dateField: '2022-02-01' },
      { id: '1', dateField: '2022-01-01' },
    ];
    const sortedArray = [...arr].sort(customDateCompare('dateField', false));
    const sortedArrayDesc = [...arr].sort(customDateCompare('dateField', true));

    expect(sortedArray).toMatchSnapshot();
    expect(sortedArrayDesc).toMatchSnapshot();
  });

  it('customStringCompare', () => {
    const arr = [
      { id: '3', stringField: 'charlie' },
      { id: '2', stringField: 'bravo' },
      { id: '1', stringField: 'alpha' },
    ];
    const sortedArray = [...arr].sort(
      customStringCompare('stringField', false),
    );
    const sortedArrayDesc = [...arr].sort(
      customStringCompare('stringField', true),
    );

    expect(sortedArray).toMatchSnapshot();
    expect(sortedArrayDesc).toMatchSnapshot();
  });

  it('externalIdArrayCompare', () => {
    const sortedArray = [
      { id: '1', name: 'first' },
      { id: '2', name: 'second' },
      { id: '3', name: 'third' },
    ].sort(externalIdArrayCompare(['3', '1', '2']));

    expect(sortedArray).toMatchSnapshot();
  });
});

describe('Utility fns', () => {
  it('zeroFill', () => {
    expect(zeroFill(1)).toMatchInlineSnapshot(`"01"`);
    expect(zeroFill(9)).toMatchInlineSnapshot(`"09"`);
    expect(zeroFill(10)).toMatchInlineSnapshot(`"10"`);
  });
});
