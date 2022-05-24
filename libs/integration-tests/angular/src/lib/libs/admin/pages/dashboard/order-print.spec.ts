import {
  summarizeServiceFeeByTax,
  summarizeVariantsByTax,
  summarizeVatByTax,
} from '@bgap/admin/refactor';
import { KeyValueObject } from '@bgap/shared/types';
import { printableOrder } from './fixtures';
import * as CrudApi from '@bgap/crud-gql/api';

describe('Order print functions', () => {
  it('summarizeServiceFeeByTax should calculate service fee summary', () => {
    const serviceFees: KeyValueObject = {};

    expect(
      summarizeServiceFeeByTax(serviceFees, printableOrder.serviceFee),
    ).toMatchSnapshot();
  });

  it('summarizeVariantsByTax should calculate variant summary', () => {
    const variants: KeyValueObject = {};

    expect(
      summarizeVariantsByTax({ localizer: value => `localized ${value}` })(
        variants,
        <CrudApi.OrderItem>printableOrder.items[0],
        CrudApi.ServingMode.inplace,
      ),
    ).toMatchSnapshot();
  });

  it('summarizeVatByTax should calculate variant summary', () => {
    const vats: KeyValueObject = {};

    expect(
      summarizeVatByTax(vats, printableOrder.items[0].sumPriceShown),
    ).toMatchSnapshot();
  });
});
