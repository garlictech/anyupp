export const missingParametersError = (paramName: string) =>
  new Error(`${paramName} parameter is missing`);
