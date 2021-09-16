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
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "295px",
    },
    chartData: { //父组件传来的参数
      type: Array,
      require:true
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  created() {},
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
      this.setOptions(this.chartData);
    },
    setOptions({ expectedData, xAxisDate } = {}) {
      this.chart.setOption({
        // title: {
        //   text: "巡检问题统计",
        //   textStyle: {
        //     color: "#fffc",
        //     "font-size": "12px",
        //   },
        // },
        color:['#777aff','#6b90e1','#78dbe0','#90fad2','#25e7e5','#1bcbc9','#783af4'],
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          bottom: 0,
          itemWidth: 10,
          itemHeight: 10,
          type: 'scroll',
          textStyle: {
            color: "#fffc",
          },
        },
        series: [
          {
            // name: "访问来源",
            type: "pie",
            radius: "50%",
            data: this.chartData,
            label: {
              normal: {
                position: 'inner',
                show : false
              }
            },
            // [
            //   { value: 1048, name: "图例1" },
            //   { value: 735, name: "图例2" },
            //   { value: 580, name: "图例3" },
            //   { value: 484, name: "图例4" },
            // ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
  watch: {
    chartData: {
      handler(val) {
        this.setOptions(val);
      },
      deep: true,
    },
  },
};
</script>
