<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="告警级别" prop="earliestTime">
        <el-select v-model="queryParams.alarmLevel" clearable filterable placeholder="请选择" size="small">
          <el-option
            v-for="dict in alarmLevelOptions"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            @keyup.enter.native="handleQuery"
            :key="dict.index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联预置位" prop="siteName">
        <el-input v-model="queryParams.siteName" placeholder="预置位名称" size="small" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['alarm:rule:query']"
                   @click="handleQuery">搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['alarm:rule:add']"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['alarm:rule:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['alarm:rule:remove']"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['alarm:rule:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <!--      <el-table-column label="告警规则ID" align="center" prop="ruleId" />-->
      <el-table-column label="告警规则名称" align="center" prop="ruleName"/>
      <el-table-column label="告警级别" align="center" prop="alarmLevel"/>
      <el-table-column label="关联缺陷数量" align="center" prop="defectCount"/>
      <el-table-column label="关联预置位" align="center" prop="siteName"/>
<!--      <el-table-column label="告警条件" align="center" prop="alarmCondition"/>-->
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-document"
                     @click="handleDetail(scope.row)"
                     v-hasPermi="['alarm:rule:details']"
          >详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['alarm:rule:edit']"
          >修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['alarm:rule:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改告警配置
      对话框-->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="告警规则名称" prop="ruleName">
          <el-col :lg="8">
            <el-input v-model="form.ruleName" placeholder="告警规则名称" :disabled="formDisabled"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="是否关联预置位" prop="selectSiteTree" :inline="true">
          <el-radio-group v-model.number="form.isRelated" :disabled="formDisabled">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预置位名称" prop="siteName" :inline="true" v-if="form.isRelated == 1">
          <el-col :lg="12">
            <el-input v-model="form.siteName" placeholder="预置位名称" :disabled="true"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item :inline="true" v-show="form.isRelated == 1">
          <el-tree
            class="inst_tree"
            :data="selectSiteTree"
            :props="selectSiteProps"
            @check-change="checkChange"
            :check-strictly="true"
            show-checkbox
            node-key="siteLabel"
            ref="selectSiteTree"
            :disabled="formDisabled">
          </el-tree>
        </el-form-item>

        <el-form-item label="缺陷类别" prop="defectTypeId">
          <el-select v-model="form.defectTypeId" placeholder="请选择" :disabled="formDisabled" @change="changeDefectType">
            <el-option
              v-for="item in defectTypeOptions"
              :key="item.defectTypeId"
              :label="item.defectTypeName"
              :value="item.defectTypeId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="selectDefectTree" v-show="showDefectTree">
          <el-tree
            :data="selectDefectTree"
            :props="selectDefectProps"
            show-checkbox
            node-key="defectLabel"
            ref="selectDefectTree"
            :disabled="formDisabled">
          </el-tree>
        </el-form-item>

        <el-form-item label="告警级别" prop="alarmLevel" v-if="!showDynamic">
          <el-select v-model="form.alarmLevel" placeholder="请选择" :disabled="formDisabled">
            <el-option
              v-for="item in alarmLevelOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="告警条件" prop="alarmCondition" v-if="!showDynamic">-->
        <!--          <el-select v-model="form.alarmCondition" placeholder="请选择" :disabled="formDisabled">-->
        <!--            <el-option-->
        <!--              v-for="item in alarmConditionOptions"-->
        <!--              :key="item.key"-->
        <!--              :label="item.value"-->
        <!--              :value="item.key">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
      </el-form>

      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" v-if="showDynamic">
        <el-row>
          <el-col :lg="8">
            <el-form-item
              v-for="(alarmLevel, index) in dynamicValidateForm.alarmLevels"
              :label="'告警级别'"
              :key="alarmLevel.key"
              :prop="'alarmLevels.' + index + '.value'"
              :rules="{
      required: true, message: '请选择告警级别', trigger: 'change'
    }"
            >
              <el-select v-model="alarmLevel.value" placeholder="请选择" :disabled="formDisabled">
                <el-option
                  v-for="item in alarmLevelOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!--          <el-col :lg="6">-->
          <!--            <el-form-item-->
          <!--              v-for="(alarmCondition, index) in dynamicValidateForm.alarmConditions"-->
          <!--              :label="'告警条件'"-->
          <!--              :key="alarmCondition.key"-->
          <!--              :prop="'alarmConditions.' + index + '.value'"-->
          <!--              :rules="{-->
          <!--      required: true, message: '请选择告警条件', trigger: 'change'-->
          <!--    }"-->
          <!--            >-->
          <!--              <el-select v-model="alarmCondition.value" placeholder="请选择" :disabled="formDisabled">-->
          <!--                <el-option-->
          <!--                  v-for="item in alarmConditionOptions"-->
          <!--                  :key="item.key"-->
          <!--                  :label="item.value"-->
          <!--                  :value="item.key">-->
          <!--                </el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->


          <el-col :lg="8">
            <el-col :lg="12">
              <el-form-item label-width="50px"
                            v-for="(thresholdCondition, index) in dynamicValidateForm.thresholdConditions"
                            :label="'阈值'"
                            :key="thresholdCondition.key"
                            :prop="'thresholdConditions.' + index + '.value'"
                            :rules="{
      required: true, message: '请选择阈值条件', trigger: 'change'
    }"
              >
                <el-select v-model="thresholdCondition.value" @change="changeThresholdCondition(index)"
                           placeholder="请选择" :disabled="formDisabled">
                  <el-option
                    v-for="item in thresholdConditionOptions"
                    :label="item.value"
                    :value="item.key"
                    :key="item.index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6">
              <el-form-item label-width="0"
                            v-for="(threshold1, index) in dynamicValidateForm.threshold1s"
                            :key="threshold1.key"
                            :prop="'threshold1s.' + index + '.value'"
                            :rules="[{
      required: true, message: '请输入阈值', trigger: 'change'
    },{ type: 'number', message: '阈值必须为数字值'}]"
              >
                <el-input v-model.number="threshold1.value" placeholder="阈值" :disabled="formDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="6">
              <el-form-item label-width="0"
                            v-for="(threshold2, index) in dynamicValidateForm.threshold2s"
                            :key="threshold2.key"
                            :prop="'threshold2s.' + index + '.value'"
                            :rules="[{
      required: true, message: '请输入阈值', trigger: 'change'
    },{ type: 'number', message: '阈值必须为数字值'}]"
              >
                <el-input v-model.number="threshold2.value" placeholder="阈值"
                          :disabled="formDisabled || dynamicValidateForm.thresholdConditions[index].value != 4"></el-input>
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :lg="8">
            <el-col :lg="24" style="text-align: center">
              <el-button icon="el-icon-plus" @click="rowAdd" :disabled="formDisabled"></el-button>
              <el-button icon="el-icon-minus" @click="rowSub" :disabled="formDisabled"></el-button>
            </el-col>
          </el-col>
        </el-row>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button v-show="!formDisabled" type="primary" @click="submitForm">确 定</el-button>
        <el-button v-show="!formDisabled" @click="cancel">取 消</el-button>
        <el-button v-show="formDisabled" @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addConfiguration,
    delConfiguration,
    updateConfiguration,
    getConfiguration,
    listConfiguration,
    exportConfiguration
  } from '@/api/alarm/configuration'

  import { getDicts } from '@/api/system/dict/data'
  import { getDefectTreeByType } from '@/api/device/defect' // 缺陷表
  import { listDefecttype } from '@/api/device/defecttype' // 缺陷类型表
  import { listSiteTree } from '@/api/device/site' // 缺陷表

  export default {
    // name: "Line",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 告警配置表格数据
        list: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          alarmLevel: undefined,
          siteName: undefined
        },
        // 表单参数
        form: {
          isRelated: 1,
          siteName: ''
        },
        dynamicValidateForm: {
          alarmLevels: [],
          alarmConditions: [],
          thresholdConditions: [],
          threshold1s: [],
          threshold2s: []
        },
        formDisabled: false,
        showDynamic: false,
        // 表单校验
        rules: {
          ruleName: [
            { required: true, message: '请输入告警名称', trigger: 'change' }
          ],
          siteName: [
            { required: true, message: '请选择预置位', trigger: 'change' }
          ],
          defectTypeId: [
            { required: true, message: '请选择缺陷类型', trigger: 'change' }
          ],
          alarmLevel: [
            { required: true, message: '请选择告警级别', trigger: 'change' }
          ]
        },
        selectDefectProps: {
          children: 'children',
          label: 'defectName',
          pid: 'parentLabel',
          id: 'defectLabel'
        },
        showDefectTree: false,
        selectSiteProps: {
          children: 'children',
          label: 'siteName',
          pid: 'parentId',
          id: 'siteId'
        },
        selectDefectTree: [],
        selectSiteTree: [],
        editCheckId: undefined,
        // 阀值单位
        thresholdConditionOptions: [
          { key: '1', value: '大于' },
          { key: '2', value: '小于' },
          { key: '3', value: '等于' },
          { key: '4', value: '介于' }
        ],
        alarmLevelOptions: [
          { key: '1', value: '紧急' },
          { key: '2', value: '重要' },
          { key: '3', value: '次要' },
          { key: '4', value: '提示' }
        ],
        defectTypeOptions: [],
        alarmLevelsKV: {
          '1': '紧急',
          '2': '重要',
          '3': '次要',
          '4': '提示'
        },
        // alarmConditionOptions: [],
        alarmConditionKV: {
          '1': '发现即告警',
          '2': '状态异常告警',
          '3': '数值超过指定值告警'
        },
        lastSiteLabel : null
      }
    },
    created() {
      // this.getDefectTree()
      this.getSiteTree()
      this.getAlarmLevelOptions()
      this.getDefectTypeOptions()
      this.getList()
      this.rowAdd()
    },
    mounted() {
    },
    methods: {
      changeThresholdCondition(index) {
        console.log('index', index)
        if (this.dynamicValidateForm.thresholdConditions[index].value != 4) {
          this.dynamicValidateForm.threshold2s[index].value = 0
        }
      },
      rowAdd() {
        this.dynamicValidateForm.alarmLevels.push({
          value: '',
          key: Date.now()
        })
        this.dynamicValidateForm.alarmConditions.push({
          value: '',
          key: Date.now()
        })
        this.dynamicValidateForm.thresholdConditions.push({
          value: '',
          key: Date.now()
        })
        this.dynamicValidateForm.threshold1s.push({
          value: '',
          key: Date.now()
        })
        this.dynamicValidateForm.threshold2s.push({
          value: '',
          key: Date.now()
        })
      },
      rowSub() {
        let index = this.dynamicValidateForm.alarmLevels.length
        if (index == 1) return
        this.dynamicValidateForm.alarmLevels.splice(index - 1)
        this.dynamicValidateForm.alarmConditions.splice(index - 1)
        this.dynamicValidateForm.thresholdConditions.splice(index - 1)
        this.dynamicValidateForm.threshold1s.splice(index - 1)
        this.dynamicValidateForm.threshold2s.splice(index - 1)
      },
      // 获取缺陷大类
      getDefectTypeOptions() {
        const param = { parentId: 0 }
        listDefecttype(param).then((response) => {
          this.defectTypeOptions = response.data
        })
      },
      changeDefectType() {
        this.showDynamic = this.form.defectTypeId == 32
        this.getDefectTree()
      },
      // 根据缺陷大类查询对应得缺陷tree
      getDefectTree() {
        getDefectTreeByType(this.form.defectTypeId).then((response) => {
          let tree = this.handleTree(response.data, 'defectLabel', 'parentLabel', 'children', '0')
          this.selectDefectTree = tree
          this.showDefectTree = true
        })
      },
      // 告警配置中预置位tree的数据
      getSiteTree() {
        listSiteTree().then((response) => {
          let data = response.data
          data.map((row) => {
            if (row.siteLabel.indexOf('s') == -1) row.disabled = true
          })
          let tree = this.handleTree(data, 'siteLabel', 'parentLabel', 'children', '0')
          this.selectSiteTree = tree
        })
      },
      checkChange(item, node, self) {
        if (node == true) {
          this.$refs.selectSiteTree.setCheckedKeys([item.siteLabel])
          this.form.siteName = item.siteName
          this.lastSiteLabel = item.siteLabel
          console.log('this.form.siteName', this.form.siteName)
        } else {
          if (this.lastSiteLabel === item.siteLabel) { // 判断是否为取消选中任何一个节点
            this.form.siteName = ''
            this.lastSiteLabel = null
            }
        }
      },
      /** 查询告警配置列表 */
      getList() {
        this.loading = true
        listConfiguration(this.queryParams).then(response => {
          response.rows.map((row) => {
            row.alarmLevel = this.alarmLevelsKV[row.alarmLevel]
            row.alarmCondition = this.alarmConditionKV[row.alarmCondition]
          })
          this.list = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 告警级别下拉列表
      getAlarmLevelOptions() {
        getDicts('alarm_level').then(response => {
          this.alarmLevelOptions = response.data
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        // this.$nextTick(() => {});
        this.form = this.$options.data().form
        this.dynamicValidateForm = this.$options.data().dynamicValidateForm
        this.rowAdd()
        if (this.$refs['form']) this.$refs['form'].resetFields()
        if (this.$refs['dynamicValidateForm']) this.$refs['dynamicValidateForm'].resetFields()
        if (this.$refs.selectDefectTree) this.$refs.selectDefectTree.setCheckedKeys([])
        if (this.$refs.selectSiteTree) this.$refs.selectSiteTree.setCheckedKeys([])
      },
      /** 搜索按钮操作 */
      handleQuery() {
        console.log('this.queryParams', this.queryParams)
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = this.$options.data().queryParams
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ruleId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        // console.log('add', this.$refs['selectSiteTree'])
        this.formDisabled = false
        this.showDefectTree = false
        this.showDynamic = false
        this.reset()
        this.open = true
        this.title = '添加告警配置'
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        // console.log('detail', this.$refs.selectSiteTree)
        this.formDisabled = true
        this.loadDetail(row)
        this.open = true
        this.title = '告警配置详情'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        // console.log('update', this.$refs.selectSiteTree)
        this.formDisabled = false
        this.loadDetail(row)
        this.open = true
        this.title = '修改告警配置'
      },
      loadDetail(row) {
        const ruleId = row.ruleId || this.ids
        getConfiguration(ruleId).then(response => {
          this.form = response.data
          this.form.isRelated = parseInt(response.data.isRelated)
          this.showDynamic = this.form.defectTypeId == 32
          this.changeDefectType()
          if (response.data.defectLabelList) {
            this.$refs.selectDefectTree.setCheckedKeys(response.data.defectLabelList)
          }
          if (response.data.siteLabel) {
            let arr = []
            arr.push(response.data.siteLabel)
            this.$refs.selectSiteTree.setCheckedKeys(arr)
          }
          let str = response.data.alarmConditionStr
          if (str) this.loadDynamicStr(str)
          this.getDefectTree()
          this.showDefectTree = true
        })
      },
      checkDynamic() {
        for (let i = 0; i < this.dynamicValidateForm.alarmLevels.length; i++) {
          let val1
          let val2
          val1 = parseInt(this.dynamicValidateForm.threshold1s[i].value)
          if (this.dynamicValidateForm.thresholdConditions[i].value == '4') {
            val2 = parseInt(this.dynamicValidateForm.threshold2s[i].value)
            if(val2 <= val1) {
              return false
            }
          }
        }
        return true
      },
      getDynamicList() {
        let list = []
        for (let i = 0; i < this.dynamicValidateForm.alarmLevels.length; i++) {
          let row = []
          row.push(this.dynamicValidateForm.alarmLevels[i].value)
          row.push('3')//告警条件为数值
          row.push(this.dynamicValidateForm.thresholdConditions[i].value)
          row.push(parseInt(this.dynamicValidateForm.threshold1s[i].value))
          if (this.dynamicValidateForm.thresholdConditions[i].value == '4') {
            row.push(parseInt(this.dynamicValidateForm.threshold2s[i].value))
          }
          list.push(row)
        }
        console.log('list', list)
        return JSON.stringify(list)
      },
      loadDynamicStr(str) {
        // console.log('loadDynamicStr',str)
        let list = JSON.parse(str)
        this.dynamicValidateForm.alarmLevels = []
        this.dynamicValidateForm.thresholdConditions = []
        this.dynamicValidateForm.threshold1s = []
        this.dynamicValidateForm.threshold2s = []
        for (let i = 0; i < list.length; i++) {
          let v = {}
          v.value = list[i][0]
          this.dynamicValidateForm.alarmLevels.push(v)
          v = {}
          v.value = list[i][2]
          this.dynamicValidateForm.thresholdConditions.push(v)
          v = {}
          v.value = list[i][3]
          this.dynamicValidateForm.threshold1s.push(v)
          if (list[i][2] == 4) {
            v = {}
            v.value = list[i][4]
          } else {
            v = {}
            v.value = 0
          }
          this.dynamicValidateForm.threshold2s.push(v)
        }
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          console.log('this.form.valid', valid)
          if (valid) {
            console.log('this.form', this.form)
            if (this.form.defectTypeId == 32) {
              this.$refs['dynamicValidateForm'].validate(valid => {
                console.log('this.dynamicValidateForm.valid', valid)
                if (valid) {
                  if(!this.checkDynamic()) {
                    this.msgWarning('右边的阀值应该大于左边的阀值')
                    return false
                  }
                  this.form.alarmConditionStr = this.getDynamicList()
                  this.form.alarmCondition = '3'
                  this.form.alarmLevel = this.dynamicValidateForm.alarmLevels[0].value
                  this.handleSave()
                } else {
                  return false
                }
              })
            } else {
              delete this.form.alarmConditionStr
              this.handleSave()
            }
          } else {
            return false
          }
        })
      },
      handleSave() {
        const checkedDefects = this.$refs['selectDefectTree'].getCheckedKeys(true)
        this.form.defectLabelList = checkedDefects
        if (this.form.isRelated == 1) {
          let checkedSites = this.$refs['selectSiteTree'].getCheckedKeys(true)
          if (checkedSites.length > 0) {
            this.form.siteLabel = checkedSites[0]
            this.form.siteId = this.form.siteLabel.slice(1)
          }
        } else {
          this.form.siteLabel = ''
          this.form.siteId = 0
        }
        const params = this.form
        console.log('handleSave.params', params)
        if (this.form.ruleId) {
          updateConfiguration(params).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.getList()
              this.open = false
            }
          })
        } else {
          addConfiguration(params).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功')
              this.getList()
              this.open = false
            }
          })
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ruleIds = row.ruleId || this.ids
        this.$confirm(
          '是否删除' + row.ruleName + '的告警规则?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(function() {
            return delConfiguration(ruleIds)
          })
          .then(() => {
            this.getList()
            this.msgSuccess('删除成功')
          })
          .catch(function() {
          })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有告警配置数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return exportConfiguration(queryParams)
          })
          .then(response => {
            this.download(response.msg)
          })
          .catch(function() {
          })
      }
    }
  }
</script>
