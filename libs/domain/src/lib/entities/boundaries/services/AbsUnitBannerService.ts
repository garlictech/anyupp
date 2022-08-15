import { ImageAsset } from '../../generated/api';

export type bannerType = 'ad' | 'cover';

export abstract class AbsUnitBannerService {
  abstract getBannersForUnit(params: {
    unitId: string;
    type: bannerType;
  }): Promise<ImageAsset[]>;

  abstract addNewBannerToUnit(params: {
    bannerImage: File;
    unitId: string;
    type: bannerType;
  }): Promise<ImageAsset[]>;

  abstract removeBannerFromUnit(params: {
    unitId: string;
    bannerPath: string;
    type: bannerType;
  }): Promise<ImageAsset[]>;

  abstract getAdBannersEnabledStatusForUnit(params: {
    unitId: string;
  }): Promise<boolean>;

  abstract toggleAdBannersEnabledStatusForUnit(params: {
    unitId: string;
  }): Promise<boolean>;
}
