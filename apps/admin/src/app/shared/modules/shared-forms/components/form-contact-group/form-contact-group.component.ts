import { get as _get } from 'lodash-es';
import { GOOGLE_API_KEY } from '../../../../const';

import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ILocation } from '@bgap/shared/types';

interface IGeocodeResponse {
  status: string;
  results: unknown[];
}

@Component({
  selector: 'bgap-form-contact-group',
  templateUrl: './form-contact-group.component.html',
})
export class FormContactGroupComponent {
  @Input() contactFormGroup: FormControl;

  constructor(private _httpClient: HttpClient) {}
  public locateAddress(): void {
    const a = _get(this.contactFormGroup, 'value.address.address');
    const ci = _get(this.contactFormGroup, 'value.address.city');
    const co = _get(this.contactFormGroup, 'value.address.country');
    const p = _get(this.contactFormGroup, 'value.address.postalCode');
    const query = encodeURI(`${co} ${p} ${ci} ${a}`);

    this._httpClient
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_API_KEY}`
      )
      .subscribe((response: IGeocodeResponse): void => {
        if (response.status === 'OK' && response.results[0]) {
          this._patchLocation(_get(response, 'results[0].geometry.location'));
        }
      });
  }

  public markerPositionChange($event): void {
    this._patchLocation($event);
  }

  private _patchLocation(location: ILocation): void {
    if (location) {
      this.contactFormGroup.patchValue({
        ...this.contactFormGroup.value,
        address: {
          location,
        },
      });
    }
  }
}
