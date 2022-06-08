import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { from } from 'rxjs';
import { concatMap, last, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Unit } from '@bgap/domain';

import { getPDF, getQR } from '../../fn';

@Injectable({
  providedIn: 'root',
})
export class QrGeneratorService {
  public printCodes(unit: Unit) {
    const zip = new JSZip();
    const tableObjects = Object.values(unit.floorMap?.objects || {}).filter(o =>
      o.t.includes('table'),
    );
    const seatObjects = Object.values(unit.floorMap?.objects || {}).filter(o =>
      o.t.includes('seat'),
    );

    from(tableObjects)
      .pipe(
        concatMap(item =>
          from(getQR(unit.id, item.tID)).pipe(
            tap(qrStr => zip.file(`t${item.tID}.svg`, qrStr)),
            switchMap(qrStr => from(getPDF(qrStr))),
            tap(pdf => zip.file(`t${item.tID}.pdf`, pdf.output())),
          ),
        ),
        last(),
        switchMap(() => seatObjects),
        concatMap(item =>
          from(getQR(unit.id, item.tID, item.sID)).pipe(
            tap(qrStr => zip.file(`t${item.tID}-s${item.sID}.svg`, qrStr)),
            switchMap(qrStr => from(getPDF(qrStr))),
            tap(pdf => zip.file(`t${item.tID}-s${item.sID}.pdf`, pdf.output())),
          ),
        ),
        last(),
        tap(() => {
          zip.generateAsync({ type: 'blob' }).then(blob => {
            saveAs(blob, `${unit.name} QR Codes.zip`);
          });
        }),
      )
      .subscribe();
  }
}
