export const missingParametersError = (paramName: string) =>
  `${paramName} parameter is missing`;

export const getUnitIsNotAcceptingOrdersError = () =>
  'Unit is not accepting orders right now. Try it later!';

export const getCartIsMissingError = () => 'Cart is missing';

export const getNoProductInUnitgError = () =>
  JSON.stringify({
    message: 'There is no product in this unit',
    code: 'ERROR_NO_PRODUCT_IN_UNIT',
  });
