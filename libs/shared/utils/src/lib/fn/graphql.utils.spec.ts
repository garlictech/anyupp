import { getSortedIds, sortById } from './graphql.utils';

describe('getSortedIds', () => {
  it('should handle simple string keys', () => {
    expect(getSortedIds([{ id: 'k38' }, { id: 'fss3' }, { id: 'poe9' }]))
      .toMatchInlineSnapshot(`
      Array [
        "fss3",
        "k38",
        "poe9",
      ]
    `);
  });
  it('should handle exact same values', () => {
    expect(getSortedIds([{ id: '2' }, { id: '1' }, { id: '1' }]))
      .toMatchInlineSnapshot(`
      Array [
        "1",
        "1",
        "2",
      ]
    `);
  });
});

describe('sortById', () => {
  it('should handle simple string keys', () => {
    expect(sortById([{ id: 'k38' }, { id: 'fss3' }, { id: 'poe9' }]))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "fss3",
        },
        Object {
          "id": "k38",
        },
        Object {
          "id": "poe9",
        },
      ]
    `);
  });
  it('should handle exact same values', () => {
    expect(sortById([{ id: '2' }, { id: '1' }, { id: '1' }]))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "1",
        },
        Object {
          "id": "1",
        },
        Object {
          "id": "2",
        },
      ]
    `);
  });
});
