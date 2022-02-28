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
import { chainsSelectors } from '@bgap/admin/store/chains';
import { unitsSelectors } from '@bgap/admin/store/units';
import { LocalizePipe } from '@bgap/admin/shared/pipes';
import * as CrudApi from '@bgap/crud-gql/api';
import { CurrencyValue, KeyValueObject } from '@bgap/shared/types';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import {
  addIncludedServiceFeeToOrderItems,
  increaseVatWithPackagingTax,
  summarizeServiceFeeByTax,
  summarizeVariantsByTax,
  summarizeVatByTax,
} from '../../fn';
import { net2gross } from '@bgap/admin/shared/utils';

type ParsedVariant = CrudApi.OrderItem & { servingMode: CrudApi.ServingMode };

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
  public parsedOrders: ParsedVariant[] = [];
  public parsedVats: CrudApi.PriceShown[] = [];
  public parsedServiceFees: CrudApi.PriceShown[] = [];
  public sum: CurrencyValue;
  public packagingSum = 0;
  public place?: CrudApi.Place | null;
  public invoiceData?: CrudApi.Invoice;
  public receiptType?: string;
  public EServingMode = CrudApi.ServingMode;
  public EServiceFeeType = CrudApi.ServiceFeeType;
  public hasPackagingFee = false; // Used in merged list
  public hasServiceFee = false; // Used in merged list

  constructor(
    private _store: Store,
    private _nbDialogRef: NbDialogRef<unknown>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _localizePipe: LocalizePipe,
  ) {
    this.sum = {
      value: 0,
      currency: '',
    };
  }

  ngOnInit() {
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
      ]) => {
        this.chain = chain;
        this.unit = unit;

        this._changeDetectorRef.detectChanges();
      },
    );

    this._groupOrders();

    this._changeDetectorRef.detectChanges();
  }

  ngOnChanges() {
    this._groupOrders();
  }

  private _groupOrders() {
    this.sum = {
      value: 0,
      currency: '',
    };
    this.packagingSum = 0;
    this.now = new Date().toString();

    let variants: KeyValueObject = {};
    const vats: KeyValueObject = {};
    const serviceFees: KeyValueObject = {};
    let lastOrderTime = 0;

    this.orders.forEach((order: CrudApi.Order) => {
      if (new Date(order.createdAt).getTime() > lastOrderTime) {
        this.place = order.place;
        lastOrderTime = new Date(order.createdAt).getTime();
      }

      // Sum items
      const orderItems = addIncludedServiceFeeToOrderItems(order);
      orderItems.forEach((item: CrudApi.OrderItem) => {
        variants = summarizeVariantsByTax({
          localizer: value => this._localizePipe.transform(value),
        })(variants, item, order.servingMode || CrudApi.ServingMode.inplace);

        vats[item.sumPriceShown.tax] = summarizeVatByTax(
          vats,
          item.sumPriceShown,
        );

        // Handle service fee
        if (
          item.serviceFee &&
          order.serviceFeePolicy?.type === this.EServiceFeeType.applicable
        ) {
          this.hasServiceFee = true;

          serviceFees[item.serviceFee.taxPercentage] = summarizeServiceFeeByTax(
            serviceFees,
            item.serviceFee,
          );

          this.sum.value += Math.round(
            item.serviceFee.netPrice *
              (1 + item.serviceFee.taxPercentage * 0.01),
          );
        }

        // SUM
        this.sum.value += item.sumPriceShown.priceSum;
        this.sum.currency = item.sumPriceShown.currency;
      });

      // Handle packaging fee
      if (
        order.packagingSum &&
        order.servingMode === this.EServingMode.takeaway
      ) {
        this.hasPackagingFee = true;

        vats[order.packagingSum.taxPercentage] = increaseVatWithPackagingTax(
          vats,
          order.packagingSum,
        );

        this.packagingSum += Math.round(
          net2gross(
            order.packagingSum.netPrice,
            order.packagingSum.taxPercentage,
          ),
        );
      }
    });

    this.sum.value += this.packagingSum;

    // Find the first invoice/receipt data (cash/card only)
    const customerInfoOrder = this.orders.find(
      o =>
        (o.transaction?.invoiceId || o.transaction?.receiptId) &&
        (o.paymentMode?.type === CrudApi.PaymentType.card ||
          o.paymentMode?.type === CrudApi.PaymentType.cash),
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
    this.parsedServiceFees = Object.values(serviceFees);
  }

  public print() {
    printJS({
      printable: 'print-content',
      type: 'html',
      showModal: false,
      targetStyles: ['*'],
      font_size: '', // need an empty value - printJS bug?
      font: 'Arial',
    });
  }

  public close() {
    this._nbDialogRef.close();
  }
}
