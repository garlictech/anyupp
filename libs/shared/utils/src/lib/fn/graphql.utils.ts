// TODO: create a recursive version of this or use something like: https://www.npmjs.com/package/omit-deep-lodash
export const removeTypeNameField = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __typename,
  ...objectWithoutTypename
}: // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
any) => objectWithoutTypename;

export const getSortedIds = (input: Array<{ id: string }>) =>
  input.map(x => x.id).sort((a, b) => (a > b ? 1 : -1));
