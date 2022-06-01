import { AdBanner } from '@bgap/domain';

export abstract class AbsUnitAdBannerService {
  abstract getAdBannersForUnit(params: { unitId: string }): Promise<AdBanner[]>;

  abstract addNewAdBannerToUnit(params: {
    bannerImage: File;
    unitId: string;
  }): Promise<AdBanner[]>;

  abstract removeAdBannerFromUnit(params: {
    unitId: string;
    bannerPath: string;
  }): Promise<AdBanner[]>;

  abstract getAdBannersEnabledStatusForUnit(params: {
    unitId: string;
  }): Promise<boolean>;

  abstract toggleAdBannersEnabledStatusForUnit(params: {
    unitId: string;
  }): Promise<boolean>;
}
