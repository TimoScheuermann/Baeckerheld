<template>
  <section class="bh-chart-income">
    <apex-chart
      type="line"
      height="300"
      width="100%"
      :options="options"
      :series="series"
    />
  </section>
</template>

<script lang="ts">
import { BakeryManager } from '@/utils/BakeryManager';
import { IncomeManager } from '@/utils/IncomeManager';
import { Vue, Component } from 'vue-property-decorator';
import VueApexCharts from 'vue-apexcharts';

@Component({ components: { 'apex-chart': VueApexCharts } })
export default class BHChartIncome extends Vue {
  get options(): unknown {
    return {
      chart: {
        toolbar: { show: true },
        parentHeightOffset: 0,
        background: 'transparent',
        fontFamily: 'inherit',
        stacked: false,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
      },
      yaxis: {
        forceNiceScale: true,
        labels: { formatter: (value: number) => (value || '0') + '€' },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        x: { format: 'yyyy-MM' },
      },
      stroke: { lineCap: 'round', width: 3, curve: 'straight' },
    };
  }

  get series(): unknown {
    const incomes = Object.entries(IncomeManager.incomes);
    return incomes
      .filter((x) => x[1].length > 0)
      .map(([bakeryId, income]) => {
        return {
          type: 'line',
          name: BakeryManager.getBakery(bakeryId)?.name,
          data: income
            .sort((a, b) => a.month.localeCompare(b.month))
            .map(({ month, income }) => {
              return {
                x: month.split('-').reverse().join('/').replace('/', '/20/'),
                y: income,
              };
            }),
        };
      });
  }
}
</script>

<style lang="scss" scoped>
.bh-chart-income {
  //
}
</style>
