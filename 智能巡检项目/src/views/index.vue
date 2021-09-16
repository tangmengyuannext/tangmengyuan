<template>
  <div class="page-container">
    <el-header class="header-div" height="100px">
      <h1>{{title}}</h1>
      <div class="right-alarm" @click="alarmClick">
        <el-badge :value="alarmCount" :max="999" class="item">
          <img :src="alarmSrc" style="width: 30px; height: 30px;"/>
        </el-badge>
      </div>
    </el-header>
    <el-row class="panel-group">
      <panel-group :subtitles="subtitles" :counts="counts" :links="links" :icons="icons"></panel-group>
    </el-row>

    <el-row style="margin: 10px auto;">
      <el-select v-model="queryParams.days" @change="getData" size="small" style="float: right;">
        <el-option
          v-for="item in daysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>告警数量</h3>
          </el-header>
          <div id="alarmTendLine" class="div-chart"/>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>事件数量</h3>
          </el-header>
          <div id="defectTendLine" class="div-chart"/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>设备/区域告警排行</h3>
          </el-header>
          <div id="alarmCategory" class="div-chart"/>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>设备/区域事件排行</h3>
          </el-header>
          <div id="defectCategory" class="div-chart"/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>设备温度曲线</h3>

            <el-select v-model="areaTempIds" multiple collapse-tags placeholder="请选择" @change="changeAreaTemp"
                       style="width: 350px; float: right; position: relative; top: -35px; right: -30px;">
              <el-option
                v-for="item in areaTempOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </el-header>
          <div id="temperLine" class="div-chart"/>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="div-wrapper">
          <el-header height="30px" class="chart-header">
            <h3>实时温度排行</h3>
            <span style="float: right; position: relative; top: -25px;">{{refreshTime}}</span>
          </el-header>
          <div id="temperCategory" class="div-chart"/>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="告警情况" :visible.sync="showDialog" :append-to-body="true"  width="900px" :before-close="handleDialogClose">
      <span style="position: relative; top: -10px;">告警类别</span>
      <el-select v-model="listParams.defectId" @change="getAlarmRealListData" clearable placeholder="告警类别" size="small"
                 style="position: relative; top: -10px; margin-left: 10px;">
        <el-option
          v-for="item in defectsOptions"
          :key="item.defectId"
          :label="item.defectName"
          :value="item.defectId"
        ></el-option>
      </el-select>
      <el-table :data="alarmRealList" height="350px">
        <el-table-column property="equipmentName" label="设备名称"></el-table-column>
        <el-table-column property="siteName" label="预置位"></el-table-column>
        <el-table-column property="alarmLevel" label="告警级别"></el-table-column>
        <el-table-column property="defectName" label="告警类别"></el-table-column>
        <el-table-column property="eventTime" label="告警时间"></el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="text" icon="el-icon-success" @click="handleSure(scope.row)">确认</el-button>
            <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetails(scope.row)">详情</el-button> -->
            <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetails(scope.row)" v-hasPermi="['alarm:real:details']">详情</el-button>
            <el-button size="mini" type="text" icon="el-icon-success" @click="handleSure(scope.row)" v-hasPermi="['alarm:real:confirm']" v-if="scope.row.confirmStatus == '0'">确认</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="showClear(scope.row)" v-hasPermi="['alarm:real:clear']" v-if="scope.row.confirmStatus == '0' ? false : true">清除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="text-align: right;"
                     @size-change="getAlarmRealListData"
                     @current-change="getAlarmRealListData"
                     :current-page.sync="listParams.pageNum"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size.sync="listParams.pageSize"
                     layout="prev, pager, next"
                     :total="total">
      </el-pagination>
    </el-dialog>
    <!-- 告警详情组件 -->
    <detail
      :is-open.sync="open"
      dialog-width="500px"
      :dialog-title="detailTitle"
      :id="alarmDetailId"
      @update:open="(val) => (open = val)"
    >
      <template v-slot:functionButton>
        <el-button type="primary" @click="handleSure(row)"
          :disabled="row.confirmStatus == '1' ? true : false"
          >{{ row.confirmStatus == "1" ? "已确认" : "确认" }}
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </detail>
     <!--清除 对话框-->
    <el-dialog
      title="清除告警"
      :visible.sync="dialogClearVisible"
      width="500px"
      append-to-body
    >
      <el-form ref="formClear" :model="formClear" :rules="rules">
        <el-form-item label="处理人" prop="disposeBy">
          <el-input
            v-model="formClear.disposeBy"
            placeholder="处理人"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="处理方式" prop="disposeNote">
          <el-input
            type="textarea"
            rows="8"
            maxlength="5000"
            v-model="formClear.disposeNote"
            placeholder="处理方式"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClear">提 交</el-button>
        <el-button @click="cancelDispose">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import PanelGroup from './PanelGroup'
  import {
    distinctStrPush,
    getAlarmCategory,
    getAlarmRealList,
    getAlarmTendLine,
    getCounts,
    getDefectCategory,
    getDefectTendLine,
    getAreaTempOptions,
    getSelectOptions,
    putSelectOptions,
    getTemperLineIndex,
    getTemperCategory,
    handleCategory,
    handleLine,
    handleLineData,
    loadCategory,
    loadLine,
    noData,
    parseArray2String,
    now
  } from '../api/overview/overview'
  import { dispose } from '@/api/alarm/realtime'
  import AlarmSrc from '../assets/image/alarm@2x.png'
  import Detail from './details/Detail.vue'
  import { getConfirms } from '@/api/survey/fan/fandetails'
  import { listDefect } from '@/api/device/defect'
  import echarts from 'echarts'

  export default {
    name: 'index',
    components: {
      PanelGroup,
      AlarmSrc,
      Detail
    },
    data() {
      return {
        title: '远程智能巡检系统',
        subtitles: [
          // '光伏区',
          // '升压站',
          // '安全管理',
          // '车辆管理'
        ],
        alarmCount: 0,
        counts: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        countsConfig: ['fan','booster','safety','car'],
        links: [
          // '/overview/fan', //风电机组
          // '/overview/booster', //升压站
          // '/overview/safety', //安全管理
          // '/overview/car' //车辆管理
        ],
        icons: [
          'fan3',
          'booster1',
          'safety',
          'car2'
        ],
        daysOptions: [
          { value: 7, label: '7日' },
          { value: 30, label: '30日' },
          { value: 90, label: '90日' }
        ],
        queryParams: {
          days: 7
        },
        listParams: {
          pageNum: 1,
          pageSize: 10
        },
        showDialog: false,
        alarmRealList: [],
        total: 0,
        defectsOptions: [],
        alarmLevelsKV: {
          '1': '紧急',
          '2': '重要',
          '3': '次要',
          '4': '提示'
        },
        areaTempIds: '',
        areaTempOptions: [],
        alarmSrc: AlarmSrc,
        // 详情弹窗
        alarmDetailId: null, // 存放查询详情数据id
        row: {
          confirmStatus: undefined,
        },
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        detailTitle: "",
        timer: ()=>{},
        refreshTime: now(),
        dialogClearVisible: false,
        formClear: {},
        // 表单校验
        rules: {
          disposeBy: [
            { required: true, message: "请输入处理人", trigger: "change" },
          ],
          disposeNote: [
            { required: true, message: "请输入处理方式", trigger: "change" },
          ],
        },
      }
    },
    created() {
      this.timer = window.setInterval(() => {
        setTimeout(this.refreshData, 0);
      }, 5 * 60 * 1000);
      this.getConfigKey('sys.index.title').then(response => {
        this.title = response.msg
      });
      this.getConfigKey('sys.index.config').then(response => {
        let text = response.msg
        // console.log('sys.index.config', text)
        if (text.length > 0) {
          const msg = JSON.parse(text)
          this.subtitles = msg.subtitles
          this.links = msg.links
        }
      });
      this.getCountsData()
      // this.getAlarmRealListData()
      this.getDicts("dev_camera_sdk").then(response => {
        this.sdkOptions = response.data;
      });
      this.getAreaTempOptionsData()
    },
    mounted() {
      this.getData()
    },
    destroyed: function () {
      clearInterval(this.timer);
    },
    methods: {
      getData() {
        this.getAlarmTendLineData()
        this.getDefectTendLineData()
        this.getAlarmCategoryData()
        this.getDefectCategoryData()
        this.getTemperLineData()
        this.getTemperCategoryData()
      },
      refreshData() {
        this.getCountsData()
        this.getTemperLineData()
        this.getTemperCategoryData()
        this.refreshTime = now()
        console.log('refreshTime',this.refreshTime)
      },
      getCountsData() {
        getCounts(this.queryParams).then((response) => {
          const counts = response.data[0]
          this.alarmCount = counts.alarmCount
          this.counts = []
          for (let i = 0; i < this.countsConfig.length; i++) {
            if (this.countsConfig[i] == 'fan') {
              this.counts.push(counts.fanCount0)
              this.counts.push(counts.fanCount1)
              this.counts.push(counts.fanCount2)
              this.counts.push(counts.fanCount3)
            }
            if (this.countsConfig[i] == 'booster') {
              this.counts.push(counts.boosterCount0)
              this.counts.push(counts.boosterCount1)
              this.counts.push(counts.boosterCount2)
              this.counts.push(counts.boosterCount3)
            }
            if (this.countsConfig[i] == 'safety') {
              this.counts.push(counts.safetyCount0)
              this.counts.push(counts.safetyCount1)
              this.counts.push(counts.safetyCount2)
              this.counts.push(counts.safetyCount3)
            }
            if (this.countsConfig[i] == 'car') {
              this.counts.push(counts.carCount0)
              this.counts.push(counts.carCount1)
              this.counts.push(counts.carCount2)
              this.counts.push(counts.carCount3)
            }
          }
          // if (JSON.stringify(this.counts) != JSON.stringify(counts)) {
          //   this.counts = counts
          // }
        })
      },
      // 告警类别下拉列表
      getAlarmTypeList() {
        listDefect().then(response => {
          this.defectsOptions = response.rows;
        });
      },
      getAlarmRealListData() {
        // this.listParams.confirmStatus = 0
        getAlarmRealList(this.listParams).then((response) => {
          this.total = response.total
          this.alarmRealList = response.rows
          let options = []
          this.alarmRealList.map((row) => {
            row.alarmLevel = this.alarmLevelsKV[row.alarmLevel]
            let obj = {}
            obj.value = row.defectId
            obj.label = row.defectName
            distinctStrPush(obj, options)
          })
          // if (options.length > this.defectsOptions.length) {
          //   this.defectsOptions = options
          // }
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
          // console.log('getDefectTendLineData', response)
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
      getTemperCategoryData() {
        getTemperCategory(this.queryParams).then((response) => {
          let data = response.data
          debugger
          let categoryData = handleCategory(data)
          this.loadCategoryTemper('temperCategory', categoryData)
        })
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
                this.queryParams.areaTempIds = areaTempIds.join(',')
              }
              this.getTemperLineData()
            })
        })
      },
      getTemperLineData() {
        if (!this.queryParams.areaTempIds) {
          let lineData = {
            legendData: []
          }
          this.loadLineTemper('temperLine', lineData)
          return
        }
        getTemperLineIndex(this.queryParams).then((response) => {
          let data = response.data
          data.map((item) => {
            if (item.lData.length > 15) {
              item.lData = item.lData.slice(0, 15) + '...'
            }
          })
          console.log('getTemperLineIndex',data)
          let lineData = handleLineData(data)
          // console.log('lineData',lineData)
          this.loadLineTemper('temperLine', lineData)
        })
      },
      alarmClick() {
        this.getAlarmRealListData()
        this.getAlarmTypeList()
        this.showDialog = true
      },
      /** 详情按钮操作 */
      handleDetails(row) {
        // console.log(row)
        this.alarmDetailId = row.alarmDetailId;
        this.row = row;
        this.open = true;
        this.detailTitle = "详情";
      },
      /** 确认按钮操作 */
      handleSure(row) {
        const alarmDetailId = row.alarmDetailId;
        getConfirms([alarmDetailId]).then((response) => {
          if (response.code === 200) {
            this.$message({
              type: "success",
              message: "已确认",
            });
            this.open = false;
            this.getAlarmRealListData();
            this.getCountsData();
          }
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      cancelDispose() {
        this.dialogClearVisible = false;
      },
      /** 清除按钮操作 */
      showClear(row) {
        this.formClear = this.$options.data().formClear;
        this.formClear.disposeBy = this.$store.state.user.name;
        if (this.$refs["formClear"]) this.$refs["formClear"].resetFields();
        this.dialogClearVisible = true;
        this.formClear.alarmDetailId = row.alarmDetailId;
      },
      /** 清除提交按钮 */
      handleClear: function () {
        this.$refs["formClear"].validate((valid) => {
          if (valid) {
            dispose(this.formClear).then((response) => {
              if (response.code === 200) {
                this.$message({
                  type: "success",
                  message: "处理成功",
                });
                this.dialogClearVisible = false;
                this.showDialog = false;
                this.listParams.defectId = '';
                this.getCountsData()
              }
            });
          }
        });
      },
      // 关闭告警弹窗
      handleDialogClose() {
        this.showDialog = false;
        this.listParams.defectId = '';
      },
      changeAreaTemp() {
        // console.log('this.areaTempIds',this.areaTempIds)
        // console.log('parseArray2String', parseArray2String(this.areaTempIds))
        this.queryParams.areaTempIds = parseArray2String(this.areaTempIds)
        this.getTemperLineData()
        this.memory()
      },
      memory() {
        // console.log('destroyed',this.areaTempIds.join(','))
        this.queryParams.areaTempIds = this.areaTempIds.length > 0 ? this.areaTempIds.join(',') : ''
        putSelectOptions(this.queryParams)
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
              let html = params[0].name
              for (let i = 0; i < params.length; i++) {
                let param = params[i]
                let circle = '<div style="position: relative; top: 15px; width: 10px; height: 10px; border-radius: 5px; background: ' + param.color + ';"></div>'
                let data = param.data ? param.data + '℃' : '-'
                html += circle + '<span style="margin-left: 15px;">' + param.seriesName + ' ' + data + '</span>' + '<br />'
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
      loadCategoryTemper(divId, categoryData) {
        let myChart = echarts.init(document.getElementById(divId), 'macarons')
        let colors = ['#6affec', '#0ECEFF', '#7575f5', '#34f0e0', '#0babbe', '#2657FF', '#78CDD1', '#FFDC51', '#51B6FF', '#1890FF'];
        let option = {
          title: {
            x: 'center',
            y: 'center',
            textStyle: {
              color: '#909399',
              fontSize: 14
            }
          },
          grid: {
            left: 0,
            right: '4%',
            bottom: '6%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            minInterval: 1,
            axisLabel: {
              formatter: function(value) {
                return '';
              }
            },
            axisLine: {
              show: false
            },
            axisTick:{
              show: false
            }
          },
          yAxis: [{
            type: 'category',
            data: categoryData.yData,
            axisLabel: {
              formatter: function(value) {
                if (value.length > 6) {
                  value = value.slice(0,6) + '...';
                }
                return value;
              }
            },
            axisLine: {
              show: false
            },
            axisTick:{
              show: false
            }
          },
          {
            type: 'category',
            data: categoryData.xData,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value}℃'
            }
          }],
          tooltip: {
            formatter: function (params, ticket, callback) {
              // console.log(params)
              let html = '';
              if (params.name) {
                html += params.name + ': ' + params.data + '℃';
              } else {
                html += '0';
              }
              return html;
            }
          },
          series: [{
            data: categoryData.xData,
            type: 'bar',
            itemStyle: {
              color: function (param) {
                return colors[param.dataIndex] || colors[0];
              }
            },
            // label: {
            //   show: true,
            //   position: 'right',
            //   valueAnimation: true,
            //   formatter: '{c}℃'
            // }
          }]
        }
        noData(categoryData.yData, option)
        myChart.setOption(option)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 10px;

    .header-div {
      text-align: center;
      padding-top: 10px;
      color: #707070;
    }

    .panel-group {
      height: 140px;
    }

    .div-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      border-radius: 10px;
      text-align: left;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
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

    .right-alarm {
      float: right;
      // position: relative;
      // top: -35px;
      // right: 12px;
      position: absolute;
      top: 20px;
      right: 26px;
      cursor: pointer;
    }

  }
</style>
