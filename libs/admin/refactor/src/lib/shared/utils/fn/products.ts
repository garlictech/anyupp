import { AbstractControl, ValidationErrors } from '@angular/forms';
import {
  ProductComponent,
  ProductComponentSet,
  ProductComponentSetType,
} from '@bgap/domain';
import { KeyValue, KeyValueObject } from '@bgap/shared/types';

export const maxSelectionValidator = (
  control: AbstractControl,
): ValidationErrors | null =>
  control.value?.type === ProductComponentSetType.modifier
    ? null
    : (control.value?.maxSelection || 0) > 0 &&
      (control.value?.maxSelection || 0) <= (control.value?.items || []).length
    ? null
    : { missing: true };

export const getProductComponentOptions = (
  productComponents: ProductComponent[],
  items: string[],
) =>
  productComponents
    .filter(productComponent => !(items || []).includes(productComponent.id))
    .map(
      (productComponent): KeyValue => ({
        key: productComponent.id,
        value: productComponent.name,
      }),
    );

export const getProductComponentObject = (
  productComponents: ProductComponent[],
) => {
  const productComponentObject: KeyValueObject = {};
  productComponents.forEach(p => (productComponentObject[p.id] = p.name));
  return productComponentObject;
};

export const getProductComponentSetOptions = (
  productComponentSets: ProductComponentSet[],
  items: string[],
) =>
  productComponentSets
    .filter(
      productComponentSet => !(items || []).includes(productComponentSet.id),
    )
    .map(
      (productComponentSet): KeyValue => ({
        key: productComponentSet.id,
        value: productComponentSet.name,
      }),
    );
