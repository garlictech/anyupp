import { Injectable } from '@angular/core';
import {
  NbFontIcon,
  NbFontIconPackParams,
  NbIcon,
  NbIconLibraries,
} from '@nebular/theme';

@Injectable({ providedIn: 'root' })
export class CustomNbIconLibraries extends NbIconLibraries {
  protected createFontIcon(
    name: string,
    content: NbIcon | string,
    params: NbFontIconPackParams,
  ): NbFontIcon {
    if (content instanceof NbFontIcon) {
      return content;
    }

    return new NbFontIcon(name, params.ligature ? name : content, params);
  }
}
