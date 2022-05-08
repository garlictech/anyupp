import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-admin-unit-banner-ui',
  templateUrl: './unit-banner-ui.component.html',
  styleUrls: ['./unit-banner-ui.component.scss'],
})
export class UnitBannerUIComponent {
  @Input() bannerPath?: string;
  @Input() bannerUrlPrefix?: string;
  @Input() disabled = false;

  @Output() deleteRequested = new EventEmitter<string>();

  get prefixedBannerUrl(): string {
    return `${this.bannerUrlPrefix}${this.bannerPath}`;
  }

  deletePressed() {
    this.deleteRequested.emit(this.bannerPath);
  }
}
