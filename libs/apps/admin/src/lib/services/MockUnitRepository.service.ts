import {
  AbsUnitRepository,
  ImageAsset,
  ImageAssetInput,
  InputMaybe,
  Unit,
  UpdateUnitInput,
} from '@bgap/domain';
import { Injectable } from '@angular/core';
import { mockUnit } from '@bgap/domain';

@Injectable({
  providedIn: 'root',
})
export class MockUnitRepositoryService extends AbsUnitRepository {
  private units: { [unitId: string]: Unit } = {
    [mockUnit.id]: {
      ...mockUnit,
      adBannersEnabled: true,
      adBanners: [
        {
          imageUrl: '640/360',
        },
        {
          imageUrl: '320/240',
        },
      ],
    },
  };

  async getById(id: string): Promise<Unit | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.units[id] || null), 1000);
    });
  }

  update(update: UpdateUnitInput): Promise<Unit | null> {
    this.units = {
      ...this.units,
      [update.id]: {
        ...this.units[update.id],
        ...(update.adBanners !== null && {
          adBanners: this.getUpdatedBannersFromInput(update.adBanners),
        }),
        ...(update.adBannersEnabled !== null && {
          adBannersEnabled: update.adBannersEnabled,
        }),
      },
    };

    return this.getById(update.id);
  }

  getUpdatedBannersFromInput(
    adBanners: InputMaybe<Array<InputMaybe<ImageAssetInput>>> | undefined,
  ): ImageAsset[] {
    console.log('input', adBanners);

    const calculated = adBanners
      ? adBanners
          .map(adBanner => {
            return adBanner ? (adBanner as ImageAsset) : null;
          })
          .filter((adBanner): adBanner is ImageAsset => adBanner !== null)
      : [];

    console.log('calculated', calculated);
    return calculated;
  }
}
