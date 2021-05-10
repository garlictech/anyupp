// TODO: create a recursive version of this or use something like: https://www.npmjs.com/package/omit-deep-lodash
export const removeTypeNameField = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  __typename,
  ...objectWithoutTypename
}: {
  __typename: string;
}) => objectWithoutTypename;
