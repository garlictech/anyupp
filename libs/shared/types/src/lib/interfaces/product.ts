import { EVariantAvailabilityType } from '../enums';

export interface IAllergen {
  id: string;
  idx: number;
}

export interface IAvailability {
  type: EVariantAvailabilityType;
  dayFrom: string;
  dayTo?: string;
  timeFrom?: string;
  timeTo?: string;
  price: number;
}

export interface IProductOrderChangeEvent {
  change: number;
  productId: string;
}
