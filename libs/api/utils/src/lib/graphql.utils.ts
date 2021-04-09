// TODO: create a recursive version of this or use something like: https://www.npmjs.com/package/omit-deep-lodash
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const removeTypeNameField = ({
  __typename,
  ...objectWithoutTypename
}: any) => objectWithoutTypename;
