import * as QRCode from 'qrcode';
import * as CrudApi from '@bgap/crud-gql/api';

export const getQR = async (
  unitId: string,
  tID?: CrudApi.Maybe<string>,
  sID?: CrudApi.Maybe<string>,
) => await QRCode.toString(`https://anyupp.com/${unitId}/${tID}/${sID}`);
