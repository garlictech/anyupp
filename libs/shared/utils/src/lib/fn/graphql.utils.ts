export const getSortedIds = (input: Array<{ id: string }>) =>
  input.map(x => x.id).sort((a, b) => (a > b ? 1 : -1));
