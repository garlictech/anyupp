import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { getPreviewSVG } from '../../pure';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-style-color-preview',
  templateUrl: './style-color-preview.component.html',
  styleUrls: ['./style-color-preview.component.scss'],
})
export class StyleColorPreviewComponent implements OnChanges {
  @Input() primaryColor?: string;
  @Input() secondaryColor?: string;

  public previeImgPath: SafeResourceUrl = '';

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnChanges() {
    this.previeImgPath = this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/svg+xml;base64,' +
        window.btoa(
          getPreviewSVG(this.primaryColor || '', this.secondaryColor || ''),
        ),
    );
  }
}
