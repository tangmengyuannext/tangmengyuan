<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../../dashboard/mixins/resize'
// import { getboosterstationEcharts } from "@/api/login"; //从参数管理中获取全局属性

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '96%'
    },
    height: {
      type: String,
      default: '530px'
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
    }
  },
  created(){
    this.getfanpiedata();
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
    getfanpiedata(){
      // console.log(this.ispropsValue,'----yue');
      // var queryform = {};
      // if(this.ispropsValue != ""){
      //   queryform = {
      //       areaType:"风机",
      //       interval:this.ispropsValue
      //   }
      // }else if(this.ispropsValue == ""){
      //   this.ispropsValue = 1;
      //   queryform = {
      //     areaType:"风机",
      //     interval:this.ispropsValue
      //   }
      // }
      // console.log(queryform);
      // getboosterstationEcharts(queryform).then(response => {
      //     console.log(response.data,'获取风机lineChart');
      //     console.log(response.data.xdata,'======',response.data.ydata);
      //     this.chart.setOption({        //加载数据图表
      //       xAxis: {
      //         data: response.data.xdata
      //       },
      //       series: [{
      //         // 根据名字对应到相应的系列
      //         data: response.data.ydata
      //       }]
      //     });
      // });
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        legend: {
          // left: 'center',
          // top: 'right',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: ['故障一', '仪器损坏', '其他故障', '显示故障', '设备故障']
        },
        series : [
          {
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
            data:this.dataList
          }
        ]
      })
    }
  },
  watch:{
      
  }
}
</script>
