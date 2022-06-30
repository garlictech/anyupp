import { AxiosStatic } from 'axios';
import { RKeeper } from '@bgap/domain';

interface Params {
  axiosInstance: AxiosStatic;
  rKeeperPosConfig: RKeeper;
  restaurantId: string;
  visitId: string;
}

export const sendOrderPaid = (params: Params): Promise<unknown> => {
  const { axiosInstance, rKeeperPosConfig, restaurantId, visitId } = params;

  return axiosInstance.request({
    url: `${rKeeperPosConfig.endpointUri}/postorder/payed/${restaurantId}/${visitId}`,
    method: 'post',
    auth: {
      username: rKeeperPosConfig.rkeeperUsername,
      password: rKeeperPosConfig.rkeeperPassword,
    },
  });
};
