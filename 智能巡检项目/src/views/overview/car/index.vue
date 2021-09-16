<template>
  <div class="app-container">
    <el-header height="40px">
      <h2 style="float: left;">车辆管理</h2>

      <el-select v-model="queryParams.days" @change="getData" size="small" style="float: right;">
        <el-option
          v-for="item in daysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-select v-model="queryParams.areaId" @change="getData" size="small" style="float: right;">
        <el-option
          v-for="item in areasOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

    </el-header>

    <el-row :gutter="20">

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>车辆告警趋势</h3>
          </el-header>
          <div id="alarmTendLine" class="div-chart"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>设备/区域告警排行</h3>
          </el-header>
          <div id="alarmCategory" class="div-chart"></div>
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="20">

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>车辆告警分布</h3>
          </el-header>
          <div id="alarmTypePie" class="div-chart"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>当日车辆进出情况</h3>
            <div style="float: right; position: relative; top:-20px; margin-left: 10px;">驶出：{{ carCounts.outCount }}
            </div>
            <div style="float: right; position: relative; top:-20px;">驶入：{{ carCounts.inCount }}</div>
          </el-header>
          <el-table :data="carList" height="254px" :show-header="false">
            <el-table-column prop="No"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div v-if="scope.row.action=='驶入'" class="drive-in">{{scope.row.action}}</div>
                <div v-if="scope.row.action=='驶出'" class="drive-out">{{scope.row.action}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="time"></el-table-column>
            <el-table-column prop="type">
              <template slot-scope="scope">
                <div v-if="scope.row.type=='陌生车辆'" class="strange-car">{{scope.row.type}}</div>
                <div v-else>{{scope.row.type}}</div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="text-align: right;"
                         @size-change="getCarListData"
                         @current-change="getCarListData"
                         :current-page.sync="queryParams.pageNum"
                         :page-sizes="[10, 20, 30, 50]"
                         :page-size.sync="queryParams.pageSize"
                         layout="prev, pager, next"
                         :total="total">
          </el-pagination>
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
    getCarCounts,
    getCarList,
    getDefectTendLine,
    getDefectTypePie,
    handleCategory,
    handleLine,
    loadCategory,
    loadLine,
    loadPie
  } from '../../../api/overview/overview'

  export default {
    name: 'booster',
    data() {
      return {
        areasOptions: [
          { value: null, label: '全部区域' },
          { value: 1, label: '升压站' },
          { value: 2, label: '配电室' },
          { value: 3, label: '风电机组' }
        ],
        daysOptions: [
          { value: 7, label: '7日' },
          { value: 30, label: '30日' },
          { value: 90, label: '90日' }
        ],
        queryParams: {
          days: 7,
          areaId: null,
          defectTypeSub: 22,
          pageNum: 1,
          pageSize: 10
        },
        carCounts: {},
        carList: [],
        total: 0
      }
    },
    created() {
      this.getCarCountsData()
      this.getCarListData()
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        // this.getTemperLineData()
        this.getAlarmTendLineData()
        // this.getDefectTendLineData()
        this.getAlarmCategoryData()
        // this.getDefectCategoryData()
        this.getAlarmTypePieData()
        // this.getDefectTypePieData()
      },
      getCarListData() {
        getCarList(this.queryParams).then((response) => {
          console.log('getCarListData', response)
          this.total = response.total
          this.carList = response.rows
        })
      },
      getCarCountsData() {
        getCarCounts(this.queryParams).then((response) => {
          console.log('getCarCountsData', response)
          this.carCounts = response.data[0]
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
      },
      getAlarmTypePieData() {
        getAlarmTypePie(this.queryParams).then((response) => {
          console.log('getAlarmTypePieData', response)
          const data = response.data
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
          const data = response.data
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

    // 车辆驶入框样式
    .drive-in {
      width: 50px;
      text-align: center;
      background-color: rgba(24, 144, 255, 0.23);
      border: 2px solid #1890FF;
      color: #1890FF;
      border-radius: 3px;
    }

    // 车辆驶出框样式
    .drive-out {
      width: 50px;
      text-align: center;
      background-color: rgba(120, 205, 209, 0.23);;
      border: 2px solid #78CDD1;
      color: #78CDD1;
      border-radius: 3px;
    }

    // 陌生车辆
    .strange-car {
      color: #DB0000;
    }

  }
</style>
