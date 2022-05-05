import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { config } from '@bgap/shared/config';
import * as CrudApi from '@bgap/crud-gql/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-contact-group',
  templateUrl: './form-contact-group.component.html',
})
export class FormContactGroupComponent {
  @Input() contactFormGroup?: FormGroup;
  @Input() showAddressForm?: boolean = true;
  @Input() showLocationForm?: boolean = true;

  constructor(
    private _httpClient: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  public locateAddress(): void {
    const a = this.contactFormGroup?.value?.address?.address;
    const ci = this.contactFormGroup?.value?.address?.city;
    const co = this.contactFormGroup?.value?.address?.country;
    const p = this.contactFormGroup?.value?.address?.postalCode;
    const query = encodeURI(`${co} ${p} ${ci} ${a}`);

    this._httpClient
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${config.GoogleApiKey}`,
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((response: any): void => {
        if (response.status === 'OK' && response.results[0]) {
          const googleLoc = response?.results?.[0]?.geometry?.location;

          this._patchLocation({
            lat: googleLoc.lat,
            lon: googleLoc.lng,
          });
        }
      });
  }

  public markerPositionChange($event: CrudApi.LocationLatLon): void {
    this._patchLocation($event);
  }

  private _patchLocation(location: CrudApi.LocationLatLon): void {
    if (location) {
      this.contactFormGroup?.patchValue({
        ...this.contactFormGroup?.value,
        location,
      });

      this._changeDetectorRef.detectChanges();
    }
  }
}
