import { IAddressInfo } from './address';
import { IContact } from './contact';
import { ILocalizedItem } from './localized-item';

export interface IChainStyle {
  __typename?: 'ChainStyle';
  colors: {
    backgroundLight: string;
    backgroundDark: string;
    borderLight: string;
    borderDark: string;
    disabled: string;
    highlight: string;
    indicator: string;
    textLight: string;
    textDark: string;
  };
  images?: {
    header: string;
    logo: string;
  };
}

export interface IChain extends IContact, IAddressInfo {
  __typename?: 'Chain';
  id: string;
  name: string;
  description: ILocalizedItem<string>;
  style: IChainStyle;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
