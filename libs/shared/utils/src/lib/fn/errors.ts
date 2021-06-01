class BackendError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }

  toJson() {
    return JSON.stringify({ message: this.message, code: this.code });
  }
}

export const missingParametersError = (paramName: string) =>
  `${paramName} parameter is missing`;

export const getUnitIsNotAcceptingOrdersError = () =>
  'Unit is not accepting orders right now. Try it later!';

export const getCartIsMissingError = () => 'Cart is missing';

export const getNoProductInUnitgError = () =>
  new BackendError(
    'There is no product in this unit',
    'ERROR_NO_PRODUCT_IN_UNIT',
  ).toJson();
