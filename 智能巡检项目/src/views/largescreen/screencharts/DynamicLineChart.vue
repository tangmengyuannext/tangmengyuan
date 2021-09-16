<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
// require("echarts/theme/macarons"); // echarts theme
import resize from "../../dashboard/mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "200px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    color: {
      type: Array,
      default: () => [],
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.chart.dispose();
        this.chart = echarts.init(this.$el);
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el);
      //   this.setOptions(this.chartData);
    },
    setOptions({ expectedData, xAxisDate, legendData } = {}) {
      this.chart.setOption({
        legend: {
          type: 'scroll',
          orient: "horizontal",
          bottom: 0,
          textStyle: {
            color: "rgba(255, 255, 255, 0.8)",
          },
          data: legendData,
        },
        color: ["#0fcc27", "#f8d758", "#22f5e1", "#df4ef9", "#f55458"],
        xAxis: {
          data: xAxisDate,
          boundaryGap: false,
          axisTick: {
            show: true,
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.8)",
            },
          },
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: "rgba(255, 255, 255, 0.8)",
                },
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 40,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        // yAxis: {
        //   axisTick: {
        //     show: false,
        //   },
        // },
        series: expectedData,
      });
    },
  },
};
</script>
