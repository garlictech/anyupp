import { getPDF, getQR } from '@bgap/admin/refactor';

describe('QrGenerator', () => {
  it('getQR should create SVG', async () => {
    expect(await getQR('unitId', 'tableId', 'seatId')).toMatchSnapshot();
  });

  it('getPDF should create QR PDF', async () => {
    expect(await getPDF('mock_QR_SVG_content')).toMatchSnapshot();
  });
});
