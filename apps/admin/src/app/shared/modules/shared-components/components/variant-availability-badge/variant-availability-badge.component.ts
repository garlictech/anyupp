import { Component, Input, OnInit } from '@angular/core';
import { EVariantAvailabilityType } from 'src/app/shared/enums';
import { IAvailability } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-variant-availability-badge',
  templateUrl: './variant-availability-badge.component.html',
  styleUrls: ['./variant-availability-badge.component.scss'],
})
export class VariantAvailabilityBadgeComponent implements OnInit {
  @Input() availability: IAvailability;
  @Input() currency: string;

  public EVariantAvailabilityType = EVariantAvailabilityType;

  constructor() {}

  ngOnInit(): void {}
}
