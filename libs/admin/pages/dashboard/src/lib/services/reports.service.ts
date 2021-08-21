import * as Chart from 'chart.js';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { ElementRef, Injectable } from '@angular/core';
import { CurrencyFormatterPipe, LocalizePipe } from '@bgap/admin/shared/pipes';
import { IProducMixArrayItem } from '@bgap/shared/types';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
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
        plugins: [ChartDataLabels],
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
              borderWidth: 2,
              yAxisID: 'y-axis-right',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.food',
              ),
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(60,186,159, 0.8)',
              yAxisID: 'y-axis-left',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.drink',
              ),
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(62,149,205,0.8)',
              yAxisID: 'y-axis-left',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.other',
              ),
              data: new Array(24).fill(0),
              backgroundColor: 'rgba(142,94,162,0.8)',
              yAxisID: 'y-axis-left',
            },
          ],
        },
        options: {
          legend: {
            position: 'bottom',
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
                position: 'left',
                id: 'y-axis-left',
              },
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
                position: 'right',
                id: 'y-axis-right',
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label =
                  (<Chart.ChartDataSets[]>data.datasets)[
                    tooltipItem.datasetIndex || 0
                  ].label || '';

                return tooltipItem.datasetIndex === 0
                  ? ` ${label}: ${tooltipItem.value}`
                  : ` ${label}: ${this._currencyFormatter.transform(
                      tooltipItem.value || '',
                      currency,
                    )}`;
              },
            },
          },
          plugins: {
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

  public createDayHistoryChart(
    chart: ElementRef<HTMLCanvasElement>,
    translateLabelsFn: () => string[],
  ) {
    return new Chart(
      <CanvasRenderingContext2D>chart.nativeElement.getContext('2d'),
      {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
          labels: translateLabelsFn(),
          datasets: [
            {
              data: [4234, 1456, undefined],
              backgroundColor: ['#ffc107', '#3e95cd', '#8e5ea2'],
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: () => {
                return ''; //tooltipItem.yLabel;
              },
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          plugins: {
            datalabels: {
              color: 'white',
              labels: {
                title: {
                  font: {
                    weight: 'bold',
                  },
                },
              },
              /* formatter: (value, ctx) => {
              console.error('value', value);
              console.error('ctx', ctx);
              const label = ctx.chart.data.datasets[ctx.datasetIndex].label;

              return label
            },*/
            },
          },
        },
      },
    );
  }

  public createDailySalesPerTypeChart(
    chart: ElementRef<HTMLCanvasElement>,
    currency: string,
    translateLabelsFn: () => string[],
    formatterFn: (value: number, ctx: Context) => unknown,
  ) {
    return new Chart(
      <CanvasRenderingContext2D>chart.nativeElement.getContext('2d'),
      {
        type: 'pie',
        plugins: [ChartDataLabels],
        data: {
          labels: translateLabelsFn(),
          datasets: [
            {
              backgroundColor: ['#3cba9f', '#3e95cd', '#8e5ea2'],
              data: [0, 0, 0],
            },
          ],
        },
        options: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: chart => {
                const data = chart.data;
                if (data.labels?.length && data.datasets?.length) {
                  return data.labels.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const ds = data.datasets?.[0];
                    const getValueAtIndexOrDefault =
                      Chart.helpers.getValueAtIndexOrDefault;
                    const arcOpts = chart.options?.elements?.arc;
                    const fill = getValueAtIndexOrDefault(
                      ds?.backgroundColor,
                      i,
                      arcOpts?.backgroundColor,
                    );
                    const stroke = getValueAtIndexOrDefault(
                      ds?.borderColor,
                      i,
                      arcOpts?.borderColor,
                    );
                    const bw = getValueAtIndexOrDefault(
                      ds?.borderWidth,
                      i,
                      arcOpts?.borderWidth,
                    );

                    return {
                      text: `${this._currencyFormatter.transform(
                        typeof ds?.data?.[i] === 'number'
                          ? (<number>ds?.data?.[i]).toString()
                          : '0',
                        currency,
                      )} - ${label}`,
                      fillStyle: fill,
                      strokeStyle: stroke,
                      lineWidth: bw,
                      hidden: meta.data[i].hidden,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label =
                  (<string[]>data.labels)[tooltipItem.index || 0] || '';
                const value: number =
                  <number>(
                    (<Chart.ChartDataSets[]>(
                      (<Chart.ChartDataSets[]>data.datasets)[0].data
                    ))[tooltipItem.index || 0]
                  ) || 0;

                return ` ${label}: ${this._currencyFormatter.transform(
                  value,
                  currency,
                )}`;
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
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

  public createDailySalesPerPaymentMethodChart(
    chart: ElementRef<HTMLCanvasElement>,
    currency: string,
    translateLabelsFn: () => string[],
    formatterFn: (value: number, ctx: Context) => unknown,
  ) {
    return new Chart(
      <CanvasRenderingContext2D>chart.nativeElement.getContext('2d'),
      {
        type: 'pie',
        plugins: [ChartDataLabels],
        data: {
          labels: translateLabelsFn(),
          datasets: [
            {
              backgroundColor: ['#3cba9f', '#3e95cd', '#8e5ea2'],
              data: [0, 0, 0],
            },
          ],
        },
        options: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: chart => {
                const data = chart.data;
                if (data.labels?.length && data.datasets?.length) {
                  return data.labels.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const ds = data.datasets?.[0];
                    const getValueAtIndexOrDefault =
                      Chart.helpers.getValueAtIndexOrDefault;
                    const arcOpts = chart.options?.elements?.arc;
                    const fill = getValueAtIndexOrDefault(
                      ds?.backgroundColor,
                      i,
                      arcOpts?.backgroundColor,
                    );
                    const stroke = getValueAtIndexOrDefault(
                      ds?.borderColor,
                      i,
                      arcOpts?.borderColor,
                    );
                    const bw = getValueAtIndexOrDefault(
                      ds?.borderWidth,
                      i,
                      arcOpts?.borderWidth,
                    );

                    return {
                      text: `${this._currencyFormatter.transform(
                        typeof ds?.data?.[i] === 'number'
                          ? (<number>ds?.data?.[i]).toString()
                          : '0',
                        currency,
                      )} - ${label}`,
                      fillStyle: fill,
                      strokeStyle: stroke,
                      lineWidth: bw,
                      hidden: meta.data[i].hidden,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label =
                  (<string[]>data.labels)[tooltipItem.index || 0] || '';
                const value: number =
                  <number>(
                    (<Chart.ChartDataSets[]>(
                      (<Chart.ChartDataSets[]>data.datasets)[0].data
                    ))[tooltipItem.index || 0]
                  ) || 0;

                return ` ${label}: ${this._currencyFormatter.transform(
                  value,
                  currency,
                )}`;
              },
            },
          },
          plugins: {
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

  public exportProductMix(
    unitName: string,
    date: Date,
    data: IProducMixArrayItem[],
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
