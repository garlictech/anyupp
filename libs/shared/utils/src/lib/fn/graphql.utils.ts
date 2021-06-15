interface ObjectWithId {
  id: string;
}

export const getSortedIds = (input: Array<ObjectWithId>) =>
  input.map(x => x.id).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

export const sortById = <T extends ObjectWithId>(input: Array<T>): Array<T> =>
  input.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
