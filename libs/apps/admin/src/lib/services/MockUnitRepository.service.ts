import { AbsUnitRepository, AdBanner, CrudApi } from '@bgap/domain';
import { unitFixture } from '@bgap/shared/fixtures';
import { Injectable } from '@angular/core';
import { AdBannerInput, InputMaybe } from '@bgap/crud-gql/api';

@Injectable({
  providedIn: 'root',
})
export class MockUnitRepositoryService extends AbsUnitRepository {
  private units: { [unitId: string]: CrudApi.Unit } = {
    [unitFixture.unit_01.id]: {
      ...unitFixture.unit_01,
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
    adBanners: InputMaybe<Array<InputMaybe<AdBannerInput>>> | undefined,
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
