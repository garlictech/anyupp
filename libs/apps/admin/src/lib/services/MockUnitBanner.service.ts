import {
  AbsImageCompressorService,
  AbsStorageService,
  AbsUnitBannerService,
  AbsUnitRepository,
  bannerType,
  ImageAsset,
  Unit,
  unitBannerAddUseCase,
  unitBannerRemoveUseCase,
} from '@bgap/domain';
import { unitBannersToggleUseCase } from '@bgap/domain';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockUnitBannerService extends AbsUnitBannerService {
  constructor(
    private storageService: AbsStorageService,
    private imageCompressorService: AbsImageCompressorService,
    private unitRepository: AbsUnitRepository,
  ) {
    super();
  }

  async getBannersForUnit({
    unitId,
    type,
  }: {
    unitId: string;
    type: bannerType;
  }): Promise<ImageAsset[]> {
    return this.getCurrentBanners(unitId, type);
  }

  addNewBannerToUnit(params: {
    bannerImage: File;
    unitId: string;
    type: bannerType;
  }): Promise<ImageAsset[]> {
    const { unitId, bannerImage, type } = params;

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
      getCurrentBanners: () => this.getCurrentBanners(unitId, type),
      updateBannersOnUnit: ({ banners }) =>
        this.updateBannersOnUnit({ unitId, banners, type }),
    });
  }

  removeBannerFromUnit(params: {
    unitId: string;
    bannerPath: string;
    type: bannerType;
  }): Promise<ImageAsset[]> {
    const { unitId, bannerPath, type } = params;

    return unitBannerRemoveUseCase({
      storagePath: bannerPath,
      getCurrentBanners: () => this.getCurrentBanners(unitId, type),
      updateBannersOnUnit: ({ banners }) =>
        this.updateBannersOnUnit({ unitId, banners, type }),
      deleteFromStorage: async ({ folderPath }) => {
        await this.storageService.removeFile({
          key: folderPath,
        });
      },
    });
  }

  async getBannersEnabledStatusForUnit({
    unitId,
    type,
  }: {
    unitId: string;
    type: bannerType;
  }): Promise<boolean> {
    const unit = await this.getCurrentUnit(unitId);

    return unit ? !!unit[`${type}BannersEnabled`] : false;
  }

  toggleBannersEnabledStatusForUnit({
    unitId,
    type,
  }: {
    unitId: string;
    type: bannerType;
  }): Promise<boolean> {
    return unitBannersToggleUseCase({
      getCurrentBannersEnabledStatus: () =>
        this.getBannersEnabledStatusForUnit({ unitId, type }),
      setBannersEnabledStatus: async ({ enabled }) => {
        await this.unitRepository.update({
          id: unitId,
          adBannersEnabled: enabled,
        });
      },
    });
  }

  private async getCurrentUnit(unitId: string): Promise<Unit | null> {
    return this.unitRepository.getById(unitId);
  }

  private async getCurrentBanners(unitId: string, type: bannerType) {
    const unit = await this.getCurrentUnit(unitId);
    return unit ? unit[`${type}Banners`] || [] : [];
  }

  private async updateBannersOnUnit({
    unitId,
    banners,
    type,
  }: {
    unitId: string;
    banners: ImageAsset[];
    type: bannerType;
  }) {
    await this.unitRepository.update({
      id: unitId,
      [`${type}Banners`]: banners,
    });
  }
}
