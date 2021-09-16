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
      default: ''
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    color: {
      type: Array,
      default: ()=>[]
    },
    chartData: {
      type: Object,
      required: true
    }
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
          text: this.title,
        },
        color: this.color,
        tooltip: {
          trigger: "axis",
        },
        legend: legendData,
        // legend: {
        //   orient: "horizontal",
        //   bottom: 0,
        //   textStyle: {
        //     color: "#fffc",
        //   },
        //   data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
        // },
        grid: {
          top: "8%",
          left: "3%",
          right: "10%",
          // bottom: "3%",
          height: '80px',
          // height: 'auto',
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.8)"
            }
          },
          boundaryGap: false,
          data: xAxisDate
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.8)"
            }
          },
          minInterval: 1
        },
        series: expectedData,
      });
    },
  },
};
</script>
