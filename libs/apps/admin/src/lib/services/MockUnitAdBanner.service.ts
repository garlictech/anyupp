import {
  AbsImageCompressorService,
  AbsStorageService,
  AbsUnitAdBannerService,
  AbsUnitRepository,
  AdBanner,
  CrudApi,
  unitBannerAddUseCase,
  unitBannerRemoveUseCase,
} from '@bgap/domain';
import { unitBannersToggleUseCase } from '@bgap/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class MockUnitAdBannerService extends AbsUnitAdBannerService {
  constructor(
    private storageService: AbsStorageService,
    private imageCompressorService: AbsImageCompressorService,
    private unitRepository: AbsUnitRepository,
  ) {
    super();
  }

  async getAdBannersForUnit({
    unitId,
  }: {
    unitId: string;
  }): Promise<AdBanner[]> {
    return this.getCurrentAdBanners(unitId);
  }

  addNewAdBannerToUnit(params: {
    bannerImage: File;
    unitId: string;
  }): Promise<AdBanner[]> {
    const { unitId, bannerImage } = params;

    return unitBannerAddUseCase({
      bannerImage,
      compressImage: ({ image, maxWidthOrHeight }) => {
        return this.imageCompressorService.compress({
          image,
          maxWidthOrHeight,
        });
      },
      uploadToStorage: async ({ file, folderPath }) => {
        return {
          storagePath: await this.storageService.uploadFile({
            file,
            folderPath,
          }),
        };
      },
      getCurrentAdBanners: () => this.getCurrentAdBanners(unitId),
      updateAdBannersOnUnit: ({ adBanners }) =>
        this.updateAdBannersOnUnit({ unitId, adBanners }),
    });
  }

  removeAdBannerFromUnit(params: {
    unitId: string;
    bannerPath: string;
  }): Promise<AdBanner[]> {
    const { unitId, bannerPath } = params;

    return unitBannerRemoveUseCase({
      storagePath: bannerPath,
      getCurrentAdBanners: () => this.getCurrentAdBanners(unitId),
      updateAdBannersOnUnit: ({ adBanners }) =>
        this.updateAdBannersOnUnit({ unitId, adBanners }),
      deleteFromStorage: async ({ folderPath }) => {
        await this.storageService.removeFile({
          key: folderPath,
        });
      },
    });
  }

  async getAdBannersEnabledStatusForUnit({
    unitId,
  }: {
    unitId: string;
  }): Promise<boolean> {
    const unit = await this.getCurrentUnit(unitId);

    return unit ? !!unit.adBannersEnabled : false;
  }

  toggleAdBannersEnabledStatusForUnit({
    unitId,
  }: {
    unitId: string;
  }): Promise<boolean> {
    return unitBannersToggleUseCase({
      getCurrentAdBannersEnabledStatus: () =>
        this.getAdBannersEnabledStatusForUnit({ unitId }),
      setAdBannersEnabledStatus: async ({ enabled }) => {
        await this.unitRepository.update({
          id: unitId,
          adBannersEnabled: enabled,
        });
      },
    });
  }

  private async getCurrentUnit(unitId: string): Promise<CrudApi.Unit | null> {
    return this.unitRepository.getById(unitId);
  }

  private async getCurrentAdBanners(unitId: string) {
    const unit = await this.getCurrentUnit(unitId);
    return unit ? unit.adBanners || [] : [];
  }

  private async updateAdBannersOnUnit({
    unitId,
    adBanners,
  }: {
    unitId: string;
    adBanners: AdBanner[];
  }) {
    await this.unitRepository.update({
      id: unitId,
      adBanners,
    });
  }
}
