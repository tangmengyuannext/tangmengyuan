<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel orange" @click="handleSetLineChartData('fan')">
        <div class="card-panel-description">
          <div class="card-panel-text">风电机组</div>
          <span class="card-panel-number">{{Fandefects.curCount}}</span>
          <p class="card-panel-percentage">{{Fandefects.rate}}%（同比增长）</p>
        </div>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="fan3" class-name="card-panel-icon"/>
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel blue" @click="handleSetLineChartData('boosterstation')">
        <div class="card-panel-description">
          <div class="card-panel-text">升压站</div>
          <!--          <span class="card-panel-number">{{Boosterstationdefects.curCount}}</span>-->
          <!--          <p class="card-panel-percentage">{{Boosterstationdefects.rate}}%（同比增长）</p>-->
          <span class="card-panel-number">{{boosterCountAndRate.curCount}}</span>
          <p class="card-panel-percentage">{{boosterCountAndRate.rate}}%（同比增长）</p>
        </div>
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="booster1" class-name="card-panel-icon"/>
        </div>

      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel yellow" @click="handleSetLineChartData('personsafety')">
        <div class="card-panel-description">
          <div class="card-panel-text">安全管理</div>
          <!--          <span class="card-panel-number">{{Savedefects.curCount}}</span>-->
          <!--          <p class="card-panel-percentage">{{Savedefects.rate}}%（同比增长）</p>-->
          <span class="card-panel-number">{{safetyCountAndRate.curCount}}</span>
          <p class="card-panel-percentage">{{safetyCountAndRate.rate}}%（同比增长）</p>
        </div>
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="personnel" class-name="card-panel-icon"/>
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel green" @click="handleSetLineChartData('car')">
        <div class="card-panel-description">
          <div class="card-panel-text">车辆管理</div>
          <span class="card-panel-number">{{Cardefects.curCount}}</span>
          <p class="card-panel-percentage">{{Cardefects.rate}}%（同比增长）</p>
        </div>
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="car" class-name="card-panel-icon"/>
        </div>
      </div>
    </el-col>
    <!-- <el-col :span="4" class="card-panel-col">
       <div class="card-panel pink" @click="handleSetLineChartData('helmet')">
           <div class="card-panel-description">
               <div class="card-panel-text">严重警告</div>
               <span class="card-panel-number">0</span>
               <p class="card-panel-percentage">3.14%（同比下降）</p>
           </div>
           <div class="card-panel-icon-wrapper icon-shopping">
               <svg-icon icon-class="helmet" class-name="card-panel-icon" />
           </div>
       </div>
   </el-col> -->
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'
  import { getfirstIndex } from '@/api/login'
  import { getSecondIndex } from '@/api/login'
  import { getCountAndRate } from '@/api/login'

  export default {
    components: {
      CountTo
    },
    data() {
      return {
        Fandefects: {},
        Boosterstationdefects: {},
        Cardefects: {},
        Savedefects: {},
        boosterCountAndRate: {},
        safetyCountAndRate: {}
      }
    },
    created() {
      this.getFjAndSyzdata()
      this.getSaveAndCar()
      this.getCountAndRate()
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
      getFjAndSyzdata() {
        var queryform = {
          areaType: ''
        }
        getfirstIndex(queryform).then(response => {
          response.data.map((v) => {
            console.log('vname:' + v.name)
            if (v.name == '风机') {
              this.Fandefects = v
            } else {
              this.Boosterstationdefects = v
            }
          })
        })
      },
      getSaveAndCar() {
        var queryform = {
          defectType: ''
        }
        getSecondIndex(queryform).then(response => {
          response.data.map((v) => {
            console.log('vname:' + v.name)
            if (v.name == '安全') {
              this.Savedefects = v
            } else {
              this.Cardefects = v
            }
          })
        })
      },
      getCountAndRate() {
        //升压站数量和百分比
        const boosterParams = {
          areaId: 896
        }
        getCountAndRate(boosterParams).then(response => {
          this.boosterCountAndRate = response.data[0]
        })
        //安全管理数量和百分比
        const safetyParams = {
          defectTypeId: 4
        }
        getCountAndRate(safetyParams).then(response => {
          this.safetyCountAndRate = response.data[0]
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    // margin-top: 18px;
    height: 160px;
    padding-top: 15px;

    .card-panel-col {
      // margin-bottom: 70px;
      width: 25%;
    }

    .orange {
      background: -webkit-linear-gradient(#fb7053, #fa8b66);
      background: -o-linear-gradient(#fb7053, #fa8b66);
      background: -moz-linear-gradient(#fb7053, #fa8b66);
      background: linear-gradient(#fb7053, #fa8b66); /* 标准的语法 */
      opacity: 0.9;
    }

    .blue {
      background: -webkit-linear-gradient(#4ba3f7, #5fbbfa);
      background: -o-linear-gradient(#4ba3f7, #5fbbfa);
      background: -moz-linear-gradient(#4ba3f7, #5fbbfa);
      background: linear-gradient(#4ba3f7, #5fbbfa); /* 标准的语法 */
      // background: gray;
      opacity: 0.9;
    }

    .yellow {
      background: -webkit-linear-gradient(#ffc755, #ffdf55);
      background: -o-linear-gradient(#ffc755, #ffdf55);
      background: -moz-linear-gradient(#ffc755, #ffdf55);
      background: linear-gradient(#ffc755, #ffdf55); /* 标准的语法 */
      opacity: 0.9;
    }

    .green {
      background: -webkit-linear-gradient(#3ad7b8, #5be9cd);
      background: -o-linear-gradient(#3ad7b8, #5be9cd);
      background: -moz-linear-gradient(#3ad7b8, #5be9cd);
      background: linear-gradient(#3ad7b8, #5be9cd); /* 标准的语法 */
      opacity: 0.9;
    }

    .pink {
      background: -webkit-linear-gradient(#fe6da3, #fe81b0);
      background: -o-linear-gradient(#fe6da3, #fe81b0);
      background: -moz-linear-gradient(#fe6da3, #fe81b0);
      background: linear-gradient(#fe6da3, #fe81b0); /* 标准的语法 */
      opacity: 0.9;
    }

    .card-panel {
      height: 140px;
      cursor: pointer;
      font-size: 12px;
      // position: relative;
      overflow: hidden;
      font-weight: lighter;
      border-radius: 10px;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);

      .icon-people, .icon-message, .icon-money, .icon-shopping {
        background: #ffffff;
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #dde014;
      }

      .card-panel-icon-wrapper {
        float: right;
        margin: 24px 24px 0 0;
        padding: 8px 8px 8px 8px;
        transition: all 0.38s ease-out;
        border-radius: 40px;
      }

      .card-panel-icon {
        float: right;
        font-size: 34px;
      }

      .card-panel-description {
        float: left;
        color: #ffffff;
        margin-left: 0px;
        margin: 15px 30px 0 30px;

        .card-panel-text {
          line-height: 24px;
          font-size: 16px;
        }

        .card-panel-number {
          font-size: 30px;
          line-height: 50px;
        }

        .card-panel-percentage {
          font-size: 12px;
          margin-top: 16px;
        }
      }

      .card-panel-title {
        // float: right;
        // margin: 26px;
        // margin-left: 0px;
        // font-weight: bold;
        // margin: 45px;
        text-align: center;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.9);
          font-size: 25px;
          // margin-bottom: 12px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
