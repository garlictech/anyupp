import {
  EProductComponentSetType,
  IKeyValue,
  IKeyValueObject,
} from '@bgap/shared/types';

import * as CrudApi from '@bgap/crud-gql/api';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export const maxSelectionValidator = (
  control: AbstractControl,
): ValidationErrors | null =>
  control.value?.type === EProductComponentSetType.MODIFIER
    ? null
    : (control.value?.maxSelection || 0) > 0 &&
      (control.value?.maxSelection || 0) <= (control.value?.items || []).length
    ? null
    : { missing: true };

export const getProductComponentOptions = (
  productComponents: CrudApi.ProductComponent[],
  items: string[],
) =>
  productComponents
    .filter(productComponent => !(items || []).includes(productComponent.id))
    .map(
      (productComponent): IKeyValue => ({
        key: productComponent.id,
        value: productComponent.name,
      }),
    );

export const getProductComponentObject = (
  productComponents: CrudApi.ProductComponent[],
) => {
  const productComponentObject: IKeyValueObject = {};
  productComponents.forEach(p => (productComponentObject[p.id] = p.name));
  return productComponentObject;
};

export const getProductComponentSetOptions = (
  productComponentSets: CrudApi.ProductComponentSet[],
  items: string[],
) =>
  productComponentSets
    .filter(
      productComponentSet => !(items || []).includes(productComponentSet.id),
    )
    .map(
      (productComponentSet): IKeyValue => ({
        key: productComponentSet.id,
        value: productComponentSet.name,
      }),
    );
