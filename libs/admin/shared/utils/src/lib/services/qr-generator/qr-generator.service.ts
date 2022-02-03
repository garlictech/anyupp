import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import { Injectable } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';

import { getQR } from '../../fn';

@Injectable({
  providedIn: 'root',
})
export class QrGeneratorService {
  public async printCodes(unit: CrudApi.Unit) {
    const zip = new JSZip();
    const seatObjects = Object.values(unit.floorMap?.objects || {}).filter(o =>
      o.t.includes('seat'),
    );

    for await (const o of seatObjects) {
      zip.file(`t${o.tID}-s${o.sID}.svg`, getQR(unit.id, o.tID, o.sID));
    }

    zip.generateAsync({ type: 'blob' }).then(blob => {
      saveAs(blob, `${unit.name} QR Codes.zip`);
    });
  }
}
