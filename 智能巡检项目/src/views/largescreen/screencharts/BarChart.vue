<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
// require("echarts/theme/macarons"); // echarts theme
import resize from "../../dashboard/mixins/resize";

const animationDuration = 6000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "150px",
    },
    autoResize: {
      type: Boolean,
      default: true,
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
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ expectedData, xAxisDate, legendData } = {}) {
      this.chart.setOption({
        title: {
          subtext: "巡检问题统计",
          subtextStyle: {
            color: "rgba(255, 255, 255, 0.8)",
            // "font-size": "8px",
            fontWeight: "normal",
            width: "30px"
          },
        },
        color: ["#1eeecc", "#059cf8"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
            right: 0,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: "rgba(255, 255, 255, 0.8)"
            },
            data: legendData,
        },
        grid: {
          height: '70vh',
          left: '15%'
        },
        toolbox: {
          show: false,
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
                lineStyle: {
                    color: "rgba(255, 255, 255, 0.8)",
                },
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            data: xAxisDate,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
                lineStyle: {
                    color: "rgba(255, 255, 255, 0.8)",
                },
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            minInterval: 1
          },
        ],
        series: expectedData,
        // [
        //   {
        //     name: "图例1",
        //     type: "bar",
        //     // itemStyle: {
        //     //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     //     { offset: 0, color: "#1eeecc" },
        //     //     { offset: 0.7, color: "#1eeecc" },
        //     //     { offset: 1, color: "#fff0" },
        //     //   ]),
        //     // },
        //     data: [ 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3 ],
        //   },
        //   {
        //     name: "图例2",
        //     type: "bar",
        //     // itemStyle: {
        //     //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     //     { offset: 0, color: "#059cf8" },
        //     //     { offset: 0.7, color: "#059cf8" },
        //     //     { offset: 1, color: "#fff0" },
        //     //   ]),
        //     // },
        //     data: [ 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3 ],
        //   },
        // ],
      });
    },
  },
};
</script>
