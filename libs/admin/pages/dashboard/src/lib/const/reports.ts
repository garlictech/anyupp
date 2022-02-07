import { Context } from 'chartjs-plugin-datalabels';
import { reducer } from '@bgap/shared/utils';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { Options } from 'chartjs-plugin-datalabels/types/options';

export const PIE_CHART_DATASET_STYLES = {
  backgroundColor: ['#3cba9f', '#3e95cd', '#8e5ea2', '#BA3C4B'],
  hoverBackgroundColor: ['#3cba9f', '#3e95cd', '#8e5ea2', '#BA3C4B'],
  borderWidth: 2,
  borderColor: 'white',
  hoverBorderWidth: 2,
  hoverBorderColor: 'white',
};

export const PIE_CHART_DATALABEL_CONFIG: _DeepPartialObject<Options> = {
  color: 'white',
  labels: {
    title: {
      font: {
        weight: 'bold',
      },
    },
  },
  formatter: (value: number, ctx: Context) => {
    const sum = (ctx.chart.data.datasets[0].data as number[]).reduce(reducer);
    const perc = ((value / sum) * 100).toFixed(0);
    return ` ${perc}%`;
  },
};
