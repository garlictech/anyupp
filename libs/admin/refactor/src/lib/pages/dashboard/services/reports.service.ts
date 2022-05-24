import Chart from 'chart.js/auto';
import DatalabelsPlugin, { Context } from 'chartjs-plugin-datalabels';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { ElementRef, Injectable } from '@angular/core';
import { CurrencyFormatterPipe, LocalizePipe } from '../../../shared/pipes';
import { ProducMixArrayItem } from '@bgap/shared/types';
import { TranslateService } from '@ngx-translate/core';

import { PIE_CHART_DATALABEL_CONFIG, PIE_CHART_DATASET_STYLES } from '../const';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private _translateService: TranslateService,
    private _localizePipe: LocalizePipe,
    private _currencyFormatter: CurrencyFormatterPipe,
  ) {}

  public createHourlyBreakdownChart(
    chart: ElementRef<HTMLCanvasElement>,
    currency: string,
    formatterFn: (value: number, ctx: Context) => unknown,
  ) {
    return new Chart(
      <CanvasRenderingContext2D>chart.nativeElement.getContext('2d'),
      {
        type: 'bar',
        plugins: [DatalabelsPlugin],
        data: {
          labels: Array.from(Array(24).keys()),
          datasets: [
            {
              type: 'line',
              label: this._translateService.instant(
                'dashboard.reports.ordersCount',
              ),
              fill: true,
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(249,94,1, 0.2)',
              borderColor: 'rgba(249,94,1, 0.8)',
              pointBorderColor: 'rgba(249,94,1, 0.8)',
              borderWidth: 2,
              yAxisID: 'yAxisRight',
              tension: 0.5,
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.food',
              ),
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(60,186,159, 0.8)',
              yAxisID: 'yAxisLeft',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.drink',
              ),
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(62,149,205,0.8)',
              yAxisID: 'yAxisLeft',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.other',
              ),
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(142,94,162,0.8)',
              yAxisID: 'yAxisLeft',
            },
            {
              type: 'bar',
              label: this._translateService.instant('common.tip'),
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(186,60,75,0.8)',
              yAxisID: 'yAxisLeft',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              beginAtZero: true,
            },
            yAxisLeft: {
              stacked: true,
              beginAtZero: true,
              position: 'left',
            },
            yAxisRight: {
              stacked: true,
              beginAtZero: true,
              position: 'right',
            },
          },

          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: context =>
                  context.datasetIndex === 0
                    ? ` ${context.dataset.label}: ${context.formattedValue}`
                    : ` ${
                        context.dataset.label
                      }: ${this._currencyFormatter.transform(
                        <string>context.raw,
                        currency,
                      )}`,
              },
            },
            datalabels: {
              color: 'white',
              labels: {
                title: {
                  font: {
                    weight: 'bold',
                  },
                },
              },
              formatter: formatterFn,
            },
          },
        },
      },
    );
  }

  public createDayHistoryChart(chart: ElementRef<HTMLCanvasElement>) {
    return new Chart(
      <CanvasRenderingContext2D>chart.nativeElement.getContext('2d'),
      {
        type: 'bar',
        plugins: [DatalabelsPlugin],
        data: {
          labels: this.translatedDayHistoryLabels(),
          datasets: [
            {
              data: [4234, 1456, undefined],
              backgroundColor: ['#ffc107', '#3e95cd', '#8e5ea2'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: () => '',
              },
            },
            datalabels: {
              color: 'white',
              labels: {
                title: {
                  font: {
                    weight: 'bold',
                  },
                },
              },
            },
          },
        },
      },
    );
  }

  public createDailySalesPerTypeChart(
    chart: ElementRef<HTMLCanvasElement>,
    currency: string,
  ) {
    return new Chart(
      <CanvasRenderingContext2D>chart.nativeElement.getContext('2d'),
      {
        type: 'pie',
        plugins: [DatalabelsPlugin],
        data: {
          labels: this.translatedProductTypeLabels(),
          datasets: [
            {
              ...PIE_CHART_DATASET_STYLES,
              data: [0, 0, 0, 0],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                generateLabels: chart => {
                  const data = chart.data;

                  if (data.labels?.length && data.datasets?.length) {
                    return data.labels.map((label, i) => {
                      const ds = data.datasets?.[0];

                      return {
                        text: `${this._currencyFormatter.transform(
                          typeof ds?.data?.[i] === 'number'
                            ? (<number>ds?.data?.[i]).toString()
                            : '0',
                          currency,
                        )} - ${label}`,
                        fillStyle: (<string[]>ds.backgroundColor)?.[i],
                        lineWidth: 0,
                        index: i,
                        datasetIndex: i,
                      };
                    });
                  }

                  return [];
                },
              },
            },
            tooltip: {
              callbacks: {
                label: context =>
                  ` ${context.label}: ${this._currencyFormatter.transform(
                    context.parsed,
                    currency,
                  )}`,
              },
            },
            datalabels: PIE_CHART_DATALABEL_CONFIG,
          },
        },
      },
    );
  }

  public createDailySalesPerPaymentMethodChart(
    chart: ElementRef<HTMLCanvasElement>,
    currency: string,
  ) {
    return new Chart(
      <CanvasRenderingContext2D>chart.nativeElement.getContext('2d'),
      {
        type: 'pie',
        plugins: [DatalabelsPlugin],
        data: {
          labels: this.translatedPaymentModeLabels(),
          datasets: [
            {
              ...PIE_CHART_DATASET_STYLES,
              data: [0, 0, 0],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                generateLabels: chart => {
                  const data = chart.data;

                  if (data.labels?.length && data.datasets?.length) {
                    return data.labels.map((label, i) => {
                      const ds = data.datasets?.[0];

                      return {
                        text: `${this._currencyFormatter.transform(
                          typeof ds?.data?.[i] === 'number'
                            ? (<number>ds?.data?.[i]).toString()
                            : '0',
                          currency,
                        )} - ${label}`,
                        fillStyle: (<string[]>ds.backgroundColor)?.[i],
                        lineWidth: 0,
                        index: i,
                        datasetIndex: i,
                      };
                    });
                  }

                  return [];
                },
              },
            },
            tooltip: {
              callbacks: {
                label: context =>
                  ` ${context.label}: ${this._currencyFormatter.transform(
                    context.parsed,
                    currency,
                  )}`,
              },
            },
            datalabels: PIE_CHART_DATALABEL_CONFIG,
          },
        },
      },
    );
  }

  public translatedProductTypeLabels = (): string[] => [
    this._translateService.instant('products.productType.food'),
    this._translateService.instant('products.productType.drink'),
    this._translateService.instant('products.productType.other'),
    this._translateService.instant('common.tip'),
  ];

  public translatedPaymentModeLabels = (): string[] => [
    this._translateService.instant('common.paymentModes.card'),
    this._translateService.instant('common.paymentModes.cash'),
    this._translateService.instant('common.paymentModes.inapp'),
  ];

  public translatedDayHistoryLabels = (): string[] => [
    this._translateService.instant('dashboard.reports.historyToday'),
    this._translateService.instant('dashboard.reports.history1W'),
    this._translateService.instant('dashboard.reports.history1Y'),
  ];

  public exportProductMix(
    unitName: string,
    date: Date,
    data: ProducMixArrayItem[],
  ) {
    const arr: (string | number)[][] = [
      ['Név', 'Típus', 'Komponens', 'Variáns', 'Termék'],
    ];

    data.forEach(product => {
      // Product row
      arr.push([
        this._localizePipe.transform(product.name),
        this._translateService.instant(
          `products.productType.${product.productType}`,
        ),
        '',
        '',
        product.quantity,
      ]);

      // Variants row
      product.variants.forEach(variant => {
        arr.push([
          this._localizePipe.transform(variant.name),
          this._translateService.instant(
            `products.productType.${product.productType}`,
          ),
          '',
          variant.quantity,
          '',
        ]);
      });

      // Components row
      product.components.forEach(component => {
        arr.push([
          this._localizePipe.transform(component.name),
          this._translateService.instant(
            `products.productType.${product.productType}`,
          ),
          component.quantity,
          '',
          '',
        ]);
      });
    });

    const myworksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
    const myworkbook: XLSX.WorkBook = {
      Sheets: { data: myworksheet },
      SheetNames: ['data'],
    };
    const excelBuffer = XLSX.write(myworkbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const _data: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE,
    });

    FileSaver.saveAs(_data, `${unitName} - ${date}` + EXCEL_EXTENSION);
  }
}
