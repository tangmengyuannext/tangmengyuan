<template>

  <div class="app-container">

    <el-button icon="el-icon-refresh" size="mini" :loading="loading" @click="click">更新</el-button>

    <el-progress v-show="showProgress" :percentage="percentage" :status="status" :format="format"
                 style="width: 200px; position: absolute; left: 120px; top: 25px;"></el-progress>

    <el-table :data="devNotifyCList" style="margin-top: 20px;">
      <el-table-column property="id" label="编号" align="center" width="100"></el-table-column>
      <el-table-column property="notifyBy" label="更新人" align="center"></el-table-column>
      <el-table-column property="notifyTime" label="更新时间" align="center"></el-table-column>
      <el-table-column property="version" label="版本号" align="center"></el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="selectDevNotifyCListData"
    />

  </div>

</template>

<script>
  import { insertDevNotifyC, selectDevNotifyCList } from '../../../api/tool/notifyC'

  export default {
    name: 'notifyC',
    data() {
      return {
        queryParams: {},
        total: 0,
        devNotifyCList: [],
        percentage: 0,
        num: 0,
        status: null,
        showProgress: false,
        loading: false
      }
    },
    created() {
      this.selectDevNotifyCListData()
    },
    mounted() {
    },
    methods: {
      selectDevNotifyCListData() {
        selectDevNotifyCList(this.queryParams).then((response) => {
          console.log('selectDevNotifyCListData',response)
          this.devNotifyCList = response.rows
          this.total = response.total;
        })
      },
      format() {
        return ''
      },
      click() {
        window.clearInterval(this.timer)
        this.percentage = 0
        this.num = 0
        this.loading = true
        this.showProgress = true
        this.process()
      },
      process() {
        // console.log('this.timer', this.timer)
        this.timer = window.setInterval(() => {
          if (this.percentage >= 100) {
            this.percentage = 100
          } else {
            this.percentage += 1
          }
          this.num += 1
        }, 100)
      }
    },
    watch: {
      percentage(val) {
        this.status = val >= 100 ? 'success' : null
        if (val == 100) {
          let params = {
            createBy: this.$store.state.user.name
          }
          insertDevNotifyC(params).then((response) => {
            console.log('insertDevNotifyC', response)
            this.selectDevNotifyCListData()
          })
        }
      },
      num(val) {
        if (val >= 110) {
          this.percentage = 0
          this.showProgress = false
          this.loading = false
        }
      }
    }
  }
</script>
