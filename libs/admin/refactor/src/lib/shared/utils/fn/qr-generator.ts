import 'svg2pdf.js';

import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';

import { Maybe } from '@bgap/domain';

export const getQR = async (
  unitId: string,
  tID?: Maybe<string>,
  sID?: Maybe<string>,
) =>
  await QRCode.toString(
    `https://anyupp.com/${unitId}/${tID}${sID ? `/${sID}` : ''}`,
  );

export const getPDF = async (qrStr: string) => {
  const parser = new DOMParser();
  const svgDomElement = parser.parseFromString(qrStr, 'image/svg+xml');
  const doc = new jsPDF();

  await doc.svg(svgDomElement.documentElement, {
    x: 10,
    y: 10,
    width: 190,
    height: 190,
  });

  return doc;
};
