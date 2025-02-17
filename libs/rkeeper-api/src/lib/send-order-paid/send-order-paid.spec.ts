import { RKeeper } from '@bgap/domain';
import { sendOrderPaid } from './send-order-paid';
import { AxiosStatic } from 'axios';

describe('SendOrderPaid', () => {
  const mockRestaurantId = '109150001';
  const mockVisitId = '1656509181-606-109150001';
  const mockRKeeperPos: RKeeper = {
    endpointUri: 'RKEEPER_ENDPOINT',
    rkeeperUsername: 'RKEEPER_USERNAME',
    rkeeperPassword: 'RKEEPER_PASSWORD',
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
