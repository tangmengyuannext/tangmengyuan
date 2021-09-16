<template>
  <div class="app-container">
    <el-header height="40px">
      <h2 style="float: left;">升压站概览</h2>
      <el-select v-model="queryParams.days" @change="getData" size="small" style="float: right;">
        <el-option
          v-for="item in daysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-header>

    <el-row :gutter="20">

      <el-col :span="24">
        <div class="div-wrapper">
          <el-header class="chart-header" style="height: 40px;padding-right: 4px;">
            <el-row>
                <h3>设备温度曲线</h3>
                <el-select v-model="areaTempIds" @change="changeAreaTemp" size="small" multiple collapse-tags
                placeholder="全部设备" style="width: 350px; float: right; position: relative; top: -35px;">
                  <el-option
                    v-for="item in areaTempOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
            </el-row>
          </el-header>
          <div id="temperLine" class="div-chart" style="padding-top: 15px;"></div>
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="20">

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>升压站告警趋势</h3>
          </el-header>
          <div id="alarmTendLine" class="div-chart"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>升压站事件趋势</h3>
          </el-header>
          <div id="defectTendLine" class="div-chart"></div>
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="20">

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>设备/区域告警排行</h3>
          </el-header>
          <div id="alarmCategory" class="div-chart"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>设备/区域事件排行</h3>
          </el-header>
          <div id="defectCategory" class="div-chart"></div>
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="20">

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>升压站告警分布</h3>
          </el-header>
          <div id="alarmTypePie" class="div-chart"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>升压站事件分布</h3>
          </el-header>
          <div id="defectTypePie" class="div-chart"></div>
        </div>
      </el-col>

    </el-row>


  </div>

</template>

<script>

  import {
    getAlarmCategory,
    getAlarmTendLine,
    getAlarmTypePie,
    getDefectCategory,
    getDefectTendLine,
    getDefectTypePie,
    getAreaTempOptions,
    getTemperLine,
    handleCategory,
    handleLine,
    handleLineData,
    loadCategory,
    loadLine,
    loadPie,
    parseArray2String, putSelectOptions, getSelectOptions, noData
  } from '../../../api/overview/overview'
  import echarts from 'echarts'

  export default {
    name: 'booster',
    data() {
      return {
        daysOptions: [
          { value: 7, label: '7日' },
          { value: 30, label: '30日' },
          { value: 90, label: '90日' }
        ],
        areaTempIds: '',
        areaTempOptions: [],
        equipmentIds: null,
        queryParams: {
          days: 7,
          areaType: 4
        }
      }
    },
    mounted() {
      this.getData()
    },
    destroyed: function () {
      clearInterval(this.timer);
    },
    methods: {
      getData() {
        this.getAreaTempOptionsData()
        this.getAlarmTendLineData()
        this.getDefectTendLineData()
        this.getAlarmCategoryData()
        this.getDefectCategoryData()
        this.getAlarmTypePieData()
        this.getDefectTypePieData()
      },
      getAreaTempOptionsData() {
        getAreaTempOptions(this.queryParams).then((response) => {
          let areaTempOptions = response.data
          areaTempOptions.map((item) => {
            if (item.label.length > 15) {
              item.label = item.label.slice(0, 15) + '...'
            }
          })
          this.areaTempOptions = areaTempOptions
          getSelectOptions(this.queryParams).then((response) => {
            let msg = response.msg
            if (msg) {
              let areaTempIds = msg.split(',')
              for (let i = 0; i < areaTempIds.length; i++) {
                areaTempIds[i] = Number(areaTempIds[i])
              }
              this.areaTempIds = areaTempIds
              console.log('this.areaTempIds', this.areaTempIds)
              this.queryParams.areaTempIds = areaTempIds.join(',')
            }
            this.getTemperLineData()
          })
        })
      },
      changeAreaTemp() {
        console.log('this.areaTempIds',this.areaTempIds)
        console.log('parseArray2String', parseArray2String(this.areaTempIds))
        this.queryParams.areaTempIds = parseArray2String(this.areaTempIds)
        this.getTemperLineData()
        this.memory()
      },
      memory() {
        console.log('destroyed',this.areaTempIds.join(','))
        this.queryParams.areaTempIds = this.areaTempIds.length > 0 ? this.areaTempIds.join(',') : ''
        putSelectOptions(this.queryParams)
      },
      getTemperLineData() {
        if (!this.queryParams.areaTempIds) {
          let lineData = {
            legendData: []
          }
          this.loadLineTemper('temperLine', lineData)
          return
        }
        getTemperLine(this.queryParams).then((response) => {
          let data = response.data
          data.map((item) => {
            if (item.lData.length > 15) {
              item.lData = item.lData.slice(0, 15) + '...'
            }
          })
          let lineData = handleLineData(response.data)
          this.loadLineTemper('temperLine', lineData)
        })
      },
      getAlarmTendLineData() {
        getAlarmTendLine(this.queryParams).then((response) => {
          let data = response.data
          let lineData = handleLine(data, '告警数量')
          loadLine('alarmTendLine', lineData)
        })
      },
      getDefectTendLineData() {
        getDefectTendLine(this.queryParams).then((response) => {
          let data = response.data
          let lineData = handleLine(data, '事件数量')
          loadLine('defectTendLine', lineData)
        })
      },
      getAlarmCategoryData() {
        getAlarmCategory(this.queryParams).then((response) => {
          let data = response.data
          let categoryData = handleCategory(data)
          loadCategory('alarmCategory', categoryData)
        })
      },
      getDefectCategoryData() {
        getDefectCategory(this.queryParams).then((response) => {
          let data = response.data
          let categoryData = handleCategory(data)
          loadCategory('defectCategory', categoryData)
        })
      },
      getAlarmTypePieData() {
        getAlarmTypePie(this.queryParams).then((response) => {
          let data = response.data
          data = this.limitPie(data)
          let legendData = []
          data.map((row) => {
            legendData.push(row.name)
          })
          let pieData = {}
          pieData.legendData = legendData
          pieData.data = data
          loadPie('alarmTypePie', pieData)
        })
      },
      getDefectTypePieData() {
        getDefectTypePie(this.queryParams).then((response) => {
          let data = response.data
          data = this.limitPie(data)
          let legendData = []
          data.map((row) => {
            legendData.push(row.name)
          })
          let pieData = {}
          pieData.legendData = legendData
          pieData.data = data
          loadPie('defectTypePie', pieData)
        })
      },
      loadLineTemper(divId, lineData) {
        let myChart = echarts.init(document.getElementById(divId), 'macarons')
        let colors = ['#1890FF', '#51B6FF', '#FFDC51', '#78CDD1', '#2657FF', '#0babbe', '#34f0e0', '#7575f5', '#0ECEFF', '#6affec']
        let option = {
          title: {
            x: 'center',
            y: 'center',
            textStyle: {
              color: '#909399',
              fontSize: 14
            }
          },
          color: colors,
          legend: {
            x: 'center',
            y: 'top',
            type: 'scroll',
            padding: 5,
            data: lineData.legendData
          },
          xAxis: {
            data: lineData.xAxisData,
            axisLabel: {
              formatter: function(value) {
                value = value.substr(5,5)
                return value;
              }
            },
            boundaryGap: false,
            axisTick: {
              show: true
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            confine: true,
            padding: [5, 10],
            formatter: function (params, ticket, callback) {
              console.log('params', params)
              let html = params[0].name + ':00'
              for (let i = 0; i < params.length; i++) {
                let param = params[i]
                let circle = '<div style="position: relative; top: 16px; width: 10px; height: 10px; border-radius: 5px; background: ' + param.color + ';"></div>'
                let data = param.data ? param.data + '℃' : '-'
                html += circle + '<span style="margin-left: 16px;">' + param.seriesName + ' ' + data + '</span>' + '<br />'
              }
              return html;
            }
          },
          yAxis: {
            axisTick: {
              show: false
            },
            minInterval: 1,
            axisLabel: {
              formatter: function(value) {
                value = value + '℃'
                return value;
              }
            },
          },
          series: lineData.expectedData
        }
        noData(lineData.legendData, option)
        myChart.setOption(option, true)
      },

    }
  }
</script>


<style lang="scss" scoped>
  .app-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .div-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      border-radius: 10px;
      text-align: left;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      margin: 10px auto;
    }

    .div-chart {
      height: 300px;
      text-align: center;
      line-height: 300px;
      color: #909399;
    }

    .chart-header {
      border-bottom: 1px solid #e6ebf5;
    }

  }
</style>
