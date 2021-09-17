import * as CrudApi from '@bgap/crud-gql/api';
import { orderFixture as ofx } from '@bgap/shared/fixtures';
import { IFloorMapUserOrderObjects } from '@bgap/shared/types';

import {
  currentStatus,
  getActiveOrdersByUser,
  getLowestStatus,
  getNextOrderItemStatus,
  getNextOrderStatus,
  getStatusColor,
} from './orders';

describe('Orders pure function tests', () => {
  describe('currentStatus', () => {
    it('should get current status', () => {
      expect(
        currentStatus([
          ofx.getOrderStatusLogItem(CrudApi.OrderStatus.placed),
          ofx.getOrderStatusLogItem(CrudApi.OrderStatus.served),
        ]),
      ).toMatchInlineSnapshot(`"served"`);
      expect(
        currentStatus([
          ofx.getOrderStatusLogItem(CrudApi.OrderStatus.ready),
          ofx.getOrderStatusLogItem(CrudApi.OrderStatus.rejected),
        ]),
      ).toMatchInlineSnapshot(`"rejected"`);
    });
  });

  describe('getNextOrderStatus', () => {
    it('should get next order status', () => {
      expect(
        getNextOrderStatus(CrudApi.OrderStatus.none),
      ).toMatchInlineSnapshot(`"placed"`);
      expect(
        getNextOrderStatus(CrudApi.OrderStatus.placed),
      ).toMatchInlineSnapshot(`"processing"`);
      expect(
        getNextOrderStatus(CrudApi.OrderStatus.processing),
      ).toMatchInlineSnapshot(`"ready"`);
      expect(
        getNextOrderStatus(CrudApi.OrderStatus.ready),
      ).toMatchInlineSnapshot(`"served"`);
    });
  });

  describe('getNextOrderItemStatus', () => {
    it('should get next order item status', () => {
      expect(
        getNextOrderItemStatus(CrudApi.OrderStatus.placed),
      ).toMatchInlineSnapshot(`"processing"`);
      expect(
        getNextOrderItemStatus(CrudApi.OrderStatus.processing),
      ).toMatchInlineSnapshot(`"ready"`);
      expect(
        getNextOrderItemStatus(CrudApi.OrderStatus.ready),
      ).toMatchInlineSnapshot(`"served"`);
    });
  });

  describe('getPrevOrderItemStatus', () => {
    it('should get prev order item status', () => {
      expect(
        getNextOrderItemStatus(CrudApi.OrderStatus.served),
      ).toMatchInlineSnapshot(`undefined`);
      expect(
        getNextOrderItemStatus(CrudApi.OrderStatus.ready),
      ).toMatchInlineSnapshot(`"served"`);
      expect(
        getNextOrderItemStatus(CrudApi.OrderStatus.processing),
      ).toMatchInlineSnapshot(`"ready"`);
    });
  });

  // describe.skip('getOrderLaneColor', () => {});

  describe('getStatusColor', () => {
    it('should get status color', () => {
      expect(getStatusColor(CrudApi.OrderStatus.none)).toMatchInlineSnapshot(
        `"danger"`,
      );
      expect(getStatusColor(CrudApi.OrderStatus.placed)).toMatchInlineSnapshot(
        `"warning"`,
      );
      expect(
        getStatusColor(CrudApi.OrderStatus.processing),
      ).toMatchInlineSnapshot(`"primary"`);
      expect(getStatusColor(CrudApi.OrderStatus.ready)).toMatchInlineSnapshot(
        `"info"`,
      );
      expect(getStatusColor(CrudApi.OrderStatus.served)).toMatchInlineSnapshot(
        `"success"`,
      );
      expect(getStatusColor(CrudApi.OrderStatus.failed)).toMatchInlineSnapshot(
        `"danger"`,
      );
      expect(
        getStatusColor(CrudApi.OrderStatus.rejected),
      ).toMatchInlineSnapshot(`"danger"`);
    });
  });

  describe('getLowestStatus', () => {
    it('should get lowest status', () => {
      expect(
        getLowestStatus([
          CrudApi.OrderStatus.placed,
          CrudApi.OrderStatus.processing,
          CrudApi.OrderStatus.ready,
          CrudApi.OrderStatus.served,
        ]),
      ).toMatchInlineSnapshot(`"placed"`);

      expect(
        getLowestStatus([
          CrudApi.OrderStatus.ready,
          CrudApi.OrderStatus.served,
        ]),
      ).toMatchInlineSnapshot(`"ready"`);

      expect(
        getLowestStatus([CrudApi.OrderStatus.served]),
      ).toMatchInlineSnapshot(`"served"`);
    });
  });

  describe('getActiveOrdersByUser', () => {
    it('should get active orders by user', () => {
      const orders = [
        ofx.convertInputToOrder(ofx.activeWaitingCardOrderInput),
        ofx.convertInputToOrder(ofx.activeWaitingCashOrderInput),
        ofx.convertInputToOrder(ofx.activeServedSuccessCardOrderInput),
        ofx.convertInputToOrder(ofx.activeServedSuccessCashOrderInput),
      ];
      const result: IFloorMapUserOrderObjects = getActiveOrdersByUser(orders);

      expect(orders.length).toBe(4);
      expect(result['test-monad'].orders.length).toBe(2);
      expect(
        result['test-monad'].orders.map(o =>
          CrudApi.currentStatus(o.statusLog),
        ),
      ).toMatchInlineSnapshot(`
        Array [
          "none",
          "none",
        ]
      `);
      expect(result['test-monad'].orders.map(o => o.transactionStatus))
        .toMatchInlineSnapshot(`
        Array [
          "waiting_for_payment",
          "waiting_for_payment",
        ]
      `);
    });
  });
});
