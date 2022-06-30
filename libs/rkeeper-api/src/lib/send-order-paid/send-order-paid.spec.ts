import { RKeeper } from '@bgap/domain';
import { sendOrderPaid } from './send-order-paid';
import { AxiosStatic } from 'axios';

describe('SendOrderPaid', () => {
  const mockRestaurantId = '109150006';
  const mockVisitId = '1656509181-606-109150006';
  const mockRKeeperPos: RKeeper = {
    endpointUri: 'https://testendpoint.ucs.hu/wp-json/vendor/v1',
    rkeeperUsername: '590_49_985_540',
    rkeeperPassword: 'f3e7c8260b2f9b1cc62208a441410a',
    anyuppUsername: 'user',
    anyuppPassword: 'Ch4nge1t!',
  };

  let mockAxiosInstance: { request: jest.Mock };

  beforeEach(() => {
    mockAxiosInstance = {
      request: jest.fn().mockReturnValue(Promise.resolve({})),
    };
  });

  it('should call correct URI - happy path', async () => {
    await sendOrderPaid({
      axiosInstance: mockAxiosInstance as unknown as AxiosStatic,
      restaurantId: mockRestaurantId,
      visitId: mockVisitId,
      rKeeperPosConfig: mockRKeeperPos,
    });

    expect(mockAxiosInstance.request.mock.calls).toMatchSnapshot();
  });
});
