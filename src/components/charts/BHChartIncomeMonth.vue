<template>
  <div class="bh-chart-income-month">
    <div v-for="month in incomes" :key="month.month">
      <br />
      <section>
        <vm-title :subtitle="month.month" />
        <vm-title :title="getTotal(month) + '€'" />
        <br />
        <apex-chart
          ref="chart"
          type="donut"
          height="100px"
          :options="getOptions(month)"
          :series="getSeries(month)"
        />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { IncomeManager } from '@/utils/IncomeManager';
import { Vue, Component } from 'vue-property-decorator';
import VueApexCharts from 'vue-apexcharts';
import { BakeryManager } from '@/utils/BakeryManager';
import { round } from '@/utils/Functions';

type Month = { month: string; bakeries: Record<string, number> };

@Component({ components: { 'apex-chart': VueApexCharts } })
export default class BHChartIncomeMonth extends Vue {
  get incomes(): Month[] {
    return IncomeManager.incomeMonth;
  }

  getTotal(month: Month): number {
    return round(Object.values(month.bakeries).reduce((a, b) => a + b, 0));
  }

  getOptions(month: Month): unknown {
    return {
      chart: {
        toolbar: { show: false },
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
      dataLabels: {
        enabled: false,
      },
      labels: Object.keys(month.bakeries).map(
        (x) => BakeryManager.getBakery(x)?.name
      ),
    };
  }

  getSeries(month: Month): number[] {
    return Object.values(month.bakeries);
  }
}
</script>

<style lang="scss" scoped>
.bh-chart-income-month {
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
