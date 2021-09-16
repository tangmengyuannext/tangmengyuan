<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '460px'
    },
    secondparamValue: { //父组件传来的参数
      type: String,
      default: ""
    }, 
  },
  data() {
    return {
      chart: null,
      dataList:[
        {value:235, name:'其他故障'},
        {value:274, name:'仪器损坏'},
        {value:310, name:'故障一'},
        {value:335, name:'显示故障'},
        {value:400, name:'设备故障'}
      ],
      ispropsValue:"",  //props的赋值
    }
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

      this.chart.setOption({
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['故障一', '仪器损坏', '其他故障', '显示故障', '设备故障']
        },
        series : [
          {
            type: 'pie',
            radius: '45%',
            center: ['50%', '40%'],
            label: {
              formatter: ' {b}\n{d}% ',
              rich: {
                b: {
                    fontSize: 16,
                    lineHeight: 33
                },
              }
            },
            data:this.dataList
          }
        ]
      })
    }
  },
  watch:{
    secondparamValue(val){ //props传来的值
      console.log(val)
      this.ispropsValue = val
    }
  }
}
</script>
