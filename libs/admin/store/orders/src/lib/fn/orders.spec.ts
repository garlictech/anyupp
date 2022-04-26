import * as CrudApi from '@bgap/crud-gql/api';
import {
  orderFixtureBase,
  productSnapshotFixture,
  unitFixture,
} from '@bgap/shared/fixtures';
import { FloorMapUserOrderObjects } from '@bgap/shared/types';

import {
  getActiveOrdersByUser,
  getNextOrderItemStatus,
  getNextOrderStatus,
  getOrderLaneColor,
  getStatusColor,
  getTableOrders,
} from './orders';
import {
  activeServedSuccessCardOrderInput,
  activeServedSuccessCashOrderInput,
  activeWaitingCardOrderInput,
  activeWaitingCashOrderInput,
} from './orders.fixture';

const orders = [
  orderFixtureBase.convertInputToOrder(activeWaitingCardOrderInput),
  orderFixtureBase.convertInputToOrder(activeWaitingCashOrderInput),
  orderFixtureBase.convertInputToOrder(activeServedSuccessCardOrderInput),
  orderFixtureBase.convertInputToOrder(activeServedSuccessCashOrderInput),
];

describe('Orders pure function tests', () => {
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

  describe('getOrderLaneColor', () => {
    const unit: CrudApi.Unit = unitFixture.unit_01;

    const orderItem = {
      ...orderFixtureBase.orderItemInputBase(
        productSnapshotFixture.chainProduct_1,
      ),
      productId: productSnapshotFixture.chainProduct_1.id,
    };

    it('should get order lane color', () => {
      expect(getOrderLaneColor(orderItem, unit)).toMatchInlineSnapshot(
        `"#e72222"`,
      );
    });
  });

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

  describe('getActiveOrdersByUser', () => {
    it('should get active orders by user', () => {
      const result: FloorMapUserOrderObjects = getActiveOrdersByUser(orders);

      expect(orders.length).toBe(4);
      expect(result['test-monad'].orders.length).toBe(4);
      expect(
        result['test-monad'].orders.map(o =>
          CrudApi.currentStatus(o.statusLog),
        ),
      ).toMatchInlineSnapshot(`
        Array [
          "none",
          "none",
          "none",
          "none",
        ]
      `);
      expect(result['test-monad'].orders.map(o => o.transactionStatus))
        .toMatchInlineSnapshot(`
        Array [
          "waiting_for_payment",
          "waiting_for_payment",
          "success",
          "success",
        ]
      `);
    });
  });

  describe('getTableOrders', () => {
    const activeOrders = getActiveOrdersByUser(orders);

    it('should get table orders from empty table list', () => {
      expect(
        Object.values(getTableOrders([], activeOrders)),
      ).toMatchInlineSnapshot(`Array []`);
    });

    it('should get table order from an existing table', () => {
      expect(
        getTableOrders(['01'], activeOrders)['01'].userOrders?.[0]?.orders
          ?.length,
      ).toBe(4);
    });
  });

  describe('getTableSeatOrders', () => {
    const activeOrders = getActiveOrdersByUser(orders);

    it('should get table seat orders from empty table list', () => {
      expect(
        Object.values(getTableOrders([], activeOrders)),
      ).toMatchInlineSnapshot(`Array []`);
    });

    it('should get table seat order from an existing table', () => {
      expect(
        getTableOrders(['01'], activeOrders)['01'].userOrders?.[0]?.orders
          ?.length,
      ).toBe(4);
    });
  });
});
