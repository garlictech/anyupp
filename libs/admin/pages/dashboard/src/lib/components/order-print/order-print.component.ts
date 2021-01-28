import * as printJS from 'print-js';
import { combineLatest } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { chainsSelectors } from '@bgap/admin/shared/chains';
import { unitsSelectors } from '@bgap/admin/shared/units';
import { IChain, ICurrencyValue, IOrder, IOrderItem, IPlace, IPriceShown, IUnit } from '@bgap/shared/types';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss']
})
export class OrderPrintComponent implements OnInit, OnChanges {
  @Input() orders: IOrder[];
  public unit: IUnit;
  public chain: IChain;
  public now: string;
  public parsedOrders: IOrder[];
  public parsedVats: IPriceShown[];
  public sum: ICurrencyValue;
  public place: IPlace;

  constructor(
    private _store: Store<any>,
    private _nbDialogRef: NbDialogRef<unknown>
  ) {
    combineLatest([
      this._store.pipe(
        select(chainsSelectors.getSeletedChain),
        filter((chain): boolean => !!chain),
        take(1)
      ),
      this._store.pipe(
        select(unitsSelectors.getSelectedUnit),
        filter((unit): boolean => !!unit),
        take(1)
      )
    ]).subscribe(([chain, unit]: [IChain, IUnit]): void => {
      this.chain = chain;
      this.unit = unit;
    });
  }

  ngOnInit(): void {
    this._groupOrders();
  }

  ngOnChanges(): void {
    this._groupOrders();
  }

  private _groupOrders(): void {
    this.sum = {
      value: 0,
      currency: ''
    };
    this.now = new Date().toString();

    const variants = {};
    const vats = {};
    let lastOrderTime = 0;

    this.orders.forEach((order: IOrder): void => {
      if (order.created > lastOrderTime) {
        this.place = order.place;
        lastOrderTime = order.created;
      }

      order.items.forEach((item: IOrderItem): void => {
        // Collect items
        if (variants[item.variantId]) {
          variants[item.variantId].quantity += item.quantity;
          variants[item.variantId].priceShown.priceSum +=
            item.priceShown.priceSum;
          variants[item.variantId].priceShown.taxSum += item.priceShown.taxSum;
        } else {
          variants[item.variantId] = {
            quantity: item.quantity,
            productName: { ...item.productName },
            priceShown: { ...item.priceShown },
            variantName: { ...item.variantName }
          };
        }

        // Collect vats
        if (vats[item.priceShown.tax]) {
          vats[item.priceShown.tax].priceSum += item.priceShown.priceSum;
          vats[item.priceShown.tax].taxSum += item.priceShown.taxSum;
        } else {
          vats[item.priceShown.tax] = {
            priceSum: item.priceShown.priceSum,
            taxSum: item.priceShown.taxSum,
            tax: item.priceShown.tax,
            currency: item.priceShown.currency
          };
        }

        // SUM
        this.sum.value += item.priceShown.priceSum;
        this.sum.currency = item.priceShown.currency;
      });
    });

    this.parsedOrders = Object.values(variants);
    this.parsedVats = Object.values(vats);
  }

  public print(): void {
    printJS({
      printable: 'print-content',
      type: 'html',
      showModal: false,
      targetStyles: ['*'],
      font_size: '', // need an empty value - printJS bug?
      font: 'Arial'
    });
  }

  public close(): void {
    this._nbDialogRef.close();
  }
}
