import * as printJS from 'print-js';
import { filter, take } from 'rxjs/operators';
import {
  IChain,
  IOrder,
  IOrderItem,
  IPlace,
  IUnit
} from '../../../../shared/interfaces';
import { IState } from '../../../../store';
import {
  chainListSelectors,
  unitListSelectors
} from '../../../../store/selectors';

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss']
})
export class OrderPrintComponent implements OnInit, OnChanges {
  @Input() orders: IOrder[];
  public unit: IUnit;
  public chain: IChain;
  public now: string;
  public parsedOrders: any[];
  public parsedVats: any[];
  public sum: any;
  public place: IPlace;

  constructor(
    private _store: Store<IState>,
    private _nbDialogRef: NbDialogRef<any>
  ) {
    combineLatest([
      this._store.pipe(
        select(chainListSelectors.getSeletedChain),
        filter((chain): boolean => !!chain),
        take(1)
      ),
      this._store.pipe(
        select(unitListSelectors.getSelectedUnit),
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
