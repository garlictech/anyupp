import { getQR } from '@bgap/admin/shared/utils';

describe('QrGenerator', () => {
  it('getQR should create SVG', async () => {
    expect(await getQR('unitId', 'tableId', 'seatId')).toMatchSnapshot();
  });
});
