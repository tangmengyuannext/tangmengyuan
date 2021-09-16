<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from '../../dashboard/mixins/resize'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '295px'
      },
      chartData: { //父组件传来的参数
        type:Object,
        require:true
      },
    },
    data() {
      return {
        chart: null,
      }
    },
    created(){

    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions({ expectedData, xAxisDate } = {}) {
        this.chart.setOption({
          legend: {
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data:xAxisDate
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          series: [{
            type: 'pie',
            radius: '45%',
            center: ['40%', '50%'],
            label: {
              formatter: ' {b}\n{d}% ',
              rich: {
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
              }
            },
            data: expectedData,
          }]
        })
      }
    },
    watch:{
      chartData: {
        handler(val) {
          this.setOptions(val)
        },
        deep: true
      }
    }
  }
</script>
