import {
  EProductComponentSetType,
  IKeyValue,
  IKeyValueObject,
  IProductComponent,
} from 'libs/shared/types/src';

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
  productComponents: IProductComponent[],
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
  productComponents: IProductComponent[],
) => {
  const productComponentObject: IKeyValueObject = {};
  productComponents.forEach(p => (productComponentObject[p.id] = p.name));
  return productComponentObject;
};
