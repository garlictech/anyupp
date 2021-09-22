export const missingParametersError = (paramName: string) =>
  `${paramName} parameter is missing`;

export const getUnitIsNotAcceptingOrdersError = () =>
  JSON.stringify({
    message: 'Unit is not accepting orders right now. Try it later!',
    code: 'ERROR_UNIT_NOT_ACCEPTING_ORDERS',
  });

export const getCartIsMissingError = () => 'Cart is missing';

export const getNoProductInUnitError = () =>
  JSON.stringify({
    message: 'There is no product in this unit',
    code: 'ERROR_NO_PRODUCT_IN_UNIT',
  });

// export const getNoUnitgError = () =>
//   JSON.stringify({
//     message: 'The selected unit is not exists in the database',
//     code: 'ERROR_UNKNOWN_UNIT',
//   });
