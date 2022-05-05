import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnChanges {
  @Input() markerLocation = {};
  @Output() positionChange = new EventEmitter();
  public zoom = 15;
  public center: google.maps.LatLngLiteral;
  public markerPosition?: google.maps.LatLngLiteral;
  public markerOptions: google.maps.MarkerOptions = { draggable: true };

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this.center = {
      lat: 0,
      lng: 0,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const location = {
      lat: parseFloat(changes.markerLocation.currentValue.lat || 0),
      lng: parseFloat(changes.markerLocation.currentValue.lon || 0),
    };

    this.markerPosition = location;
    this.center = location;

    this._changeDetectorRef.detectChanges();
  }

  public dragEnd($event: google.maps.MapMouseEvent): void {
    this.positionChange.emit({
      lat: $event.latLng?.lat(),
      lon: $event.latLng?.lng(),
    });
  }
}
