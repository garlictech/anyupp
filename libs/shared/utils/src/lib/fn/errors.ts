export const missingParametersError = (paramName: string) =>
  `${paramName} parameter is missing`;

export const getNoProductInUnitError = () =>
  JSON.stringify({
    message: 'There is no product in this unit',
    code: 'ERROR_NO_PRODUCT_IN_UNIT',
  });
