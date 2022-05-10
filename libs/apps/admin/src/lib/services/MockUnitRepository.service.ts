import { AbsUnitRepository, AdBanner, CrudApi } from '@bgap/domain';
import { Injectable } from '@angular/core';
import { mockUnit } from '@bgap/domain';

@Injectable({
  providedIn: 'root',
})
export class MockUnitRepositoryService extends AbsUnitRepository {
  private units: { [unitId: string]: CrudApi.Unit } = {
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

  async getById(id: string): Promise<CrudApi.Unit | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.units[id] || null), 1000);
    });
  }

  update(update: CrudApi.UpdateUnitInput): Promise<CrudApi.Unit | null> {
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
    adBanners:
      | CrudApi.InputMaybe<Array<CrudApi.InputMaybe<CrudApi.AdBannerInput>>>
      | undefined,
  ): AdBanner[] {
    console.log('input', adBanners);

    const calculated = adBanners
      ? adBanners
          .map(adBanner => {
            return adBanner ? (adBanner as AdBanner) : null;
          })
          .filter((adBanner): adBanner is AdBanner => adBanner !== null)
      : [];

    console.log('calculated', calculated);
    return calculated;
  }
}
