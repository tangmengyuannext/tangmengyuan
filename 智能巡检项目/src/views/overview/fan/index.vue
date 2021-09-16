<template>
  <div class="app-container">
    <el-header height="40px">
      <h2 style="float: left;">风机概览</h2>

      <el-select v-model="queryParams.days" @change="getData" size="small" style="float: right;">
        <el-option
          v-for="item in daysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-select v-model="queryParams.areaId" @change="getData" size="small" style="float: right;"
                 placeholder="全部风机">
        <el-option
          v-for="item in areasOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

    </el-header>

    <el-row :gutter="20">

      <el-col :span="24">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>设备温度曲线</h3>
          </el-header>
          <div id="temperLine" class="div-chart"></div>
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="20">

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>风机告警趋势</h3>
          </el-header>
          <div id="alarmTendLine" class="div-chart"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>风机事件趋势</h3>
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
            <h3>风机告警分布</h3>
          </el-header>
          <div id="alarmTypePie" class="div-chart"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>风机事件分布</h3>
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
    getAreas,
    getDefectCategory,
    getDefectTendLine,
    getDefectTypePie,
    getTemperLine,
    handleCategory,
    handleLine,
    handleLineData,
    loadCategory,
    loadLine,
    loadPie
  } from '../../../api/overview/overview'

  export default {
    name: 'fan',
    data() {
      return {
        daysOptions: [
          { value: 7, label: '7日' },
          { value: 30, label: '30日' },
          { value: 90, label: '90日' }
        ],
        areasOptions: [
          { value: 0, label: '全部风机' }
        ],
        queryParams: {
          days: 7,
          areaType: 1
        }
      }
    },
    created() {
      this.getAreasOptions()
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.getTemperLineData()
        this.getAlarmTendLineData()
        this.getDefectTendLineData()
        this.getAlarmCategoryData()
        this.getDefectCategoryData()
        this.getAlarmTypePieData()
        this.getDefectTypePieData()
      },
      getAreasOptions() {
        getAreas(this.queryParams).then((response) => {
          console.log('getAreasOptions', response)
          if (this.areasOptions.length == 1) {
            let areasOptions = response.data
            for (const area of areasOptions) {
              this.areasOptions.push(area)
            }
          }
        })
      },
      getTemperLineData() {
        getTemperLine(this.queryParams).then((response) => {
          console.log('getTemperLineData', response)
          let lineData = handleLineData(response.data)
          console.log('handleLineData', lineData)
          loadLine('temperLine', lineData)
        })
      },
      getAlarmTendLineData() {
        getAlarmTendLine(this.queryParams).then((response) => {
          console.log('getAlarmTendLineData', response)
          let data = response.data
          let lineData = handleLine(data, '告警数量')
          loadLine('alarmTendLine', lineData)
        })
      },
      getDefectTendLineData() {
        getDefectTendLine(this.queryParams).then((response) => {
          console.log('getDefectTendLineData', response)
          let data = response.data
          let lineData = handleLine(data, '事件数量')
          loadLine('defectTendLine', lineData)
        })
      },
      getAlarmCategoryData() {
        getAlarmCategory(this.queryParams).then((response) => {
          console.log('getAlarmCategoryData', response)
          let data = response.data
          let categoryData = handleCategory(data)
          loadCategory('alarmCategory', categoryData)
        })
      },
      getDefectCategoryData() {
        getDefectCategory(this.queryParams).then((response) => {
          console.log('getDefectCategoryData', response)
          let data = response.data
          let categoryData = handleCategory(data)
          loadCategory('defectCategory', categoryData)
        })
      },
      getAlarmTypePieData() {
        getAlarmTypePie(this.queryParams).then((response) => {
          console.log('getAlarmTypePieData', response)
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
          console.log('getDefectTypePieData', response)
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
      }

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
