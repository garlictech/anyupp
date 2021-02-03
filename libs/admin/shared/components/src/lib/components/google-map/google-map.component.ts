import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

// eslint-disable-next-line
declare const google: any;

interface IMarkerData  {
  options?: google.maps.MarkerOptions;
  position?: google.maps.LatLngLiteral | google.maps.LatLng;
  location?: {
    lat: number;
    lng: number;
  }
}

@Component({
  selector: 'bgap-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnChanges {
  @Input() markerLocation = {};
  @Output() positionChange = new EventEmitter();
  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info?: MapInfoWindow;
  @ViewChild(MapMarker, { static: false }) markerElem?: MapMarker;
  public zoom = 15;
  public center: google.maps.LatLngLiteral;
  public markerData: IMarkerData;

  constructor() {
    this.markerData = {
      options: {
        draggable: true,
      },
    };

    this.center = {
      lat: 0,
      lng: 0,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.markerData.location = {
      lat: parseFloat(changes.markerLocation.currentValue.lat || 0),
      lng: parseFloat(changes.markerLocation.currentValue.lng || 0),
    };

    if (this.markerElem) {
      this.markerElem.position = this.markerData.location;
    }

    if (this.map) {
      this.map.center = this.markerData.location;
    }
  }

  public dragEnd($event: google.maps.MouseEvent): void {
    this.positionChange.emit({
      lat: $event.latLng?.lat(),
      lng: $event.latLng?.lng(),
    });
  }
}
