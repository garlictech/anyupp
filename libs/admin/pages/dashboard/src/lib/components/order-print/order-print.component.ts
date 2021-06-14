import * as printJS from 'print-js';
import { combineLatest } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { ICurrencyValue, IKeyValueObject } from '@bgap/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss'],
})
export class OrderPrintComponent implements OnInit, OnChanges {
  @Input() orders!: CrudApi.Order[];
  public unit?: CrudApi.Unit;
  public chain?: CrudApi.Chain;
  public now = '';
  public parsedOrders: CrudApi.OrderItem[] = [];
  public parsedVats: CrudApi.PriceShown[] = [];
  public sum: ICurrencyValue;
  public place?: CrudApi.Place | null;
  public invoiceData?: CrudApi.Invoice;
  public receiptType?: string;

  constructor(
    private _store: Store,
    private _nbDialogRef: NbDialogRef<unknown>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.sum = {
      value: 0,
      currency: '',
    };
  }

  ngOnInit(): void {
    combineLatest([
      this._store.pipe(
        select(chainsSelectors.getSeletedChain),
        filter((chain): boolean => !!chain),
        take(1),
      ),
      this._store.pipe(
        select(unitsSelectors.getSelectedUnit),
        filter((unit): boolean => !!unit),
        take(1),
      ),
    ]).subscribe(
      ([chain, unit]: [
        CrudApi.Chain | undefined,
        CrudApi.Unit | undefined,
      ]): void => {
        this.chain = chain;
        this.unit = unit;

        this._changeDetectorRef.detectChanges();
      },
    );

    this._groupOrders();

    this._changeDetectorRef.detectChanges();
  }

  ngOnChanges(): void {
    this._groupOrders();
  }

  private _groupOrders(): void {
    this.sum = {
      value: 0,
      currency: '',
    };
    this.now = new Date().toString();

    const variants: IKeyValueObject = {};
    const vats: IKeyValueObject = {};
    let lastOrderTime = 0;

    this.orders.forEach((order: CrudApi.Order): void => {
      if (new Date(order.createdAt).getTime() > lastOrderTime) {
        this.place = order.place;
        lastOrderTime = new Date(order.createdAt).getTime();
      }

      order.items.forEach((item: CrudApi.OrderItem): void => {
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
            variantName: { ...item.variantName },
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
            currency: item.priceShown.currency,
          };
        }

        // SUM
        this.sum.value += item.priceShown.priceSum;
        this.sum.currency = item.priceShown.currency;
      });
    });

    // Find the first invoice/receipt data (cash/card only)
    const customerInfoOrder = this.orders.find(
      o =>
        (o.transaction?.invoiceId || o.transaction?.receiptId) &&
        (o.paymentMode.type === CrudApi.PaymentType.card ||
          o.paymentMode.type === CrudApi.PaymentType.cash),
    );
    if (customerInfoOrder) {
      this.receiptType = customerInfoOrder.transaction?.invoiceId
        ? 'invoice'
        : customerInfoOrder.transaction?.receiptId
        ? 'receipt'
        : '';

      this.invoiceData = customerInfoOrder.transaction?.invoice || undefined;
    }

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
      font: 'Arial',
    });
  }

  public close(): void {
    this._nbDialogRef.close();
  }
}
