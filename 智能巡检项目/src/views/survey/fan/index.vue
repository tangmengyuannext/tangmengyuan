<template>
    <div class="app-container">
        <div class="content">
            <el-col :xs="24" :sm="8" :lg="4" v-for="fans in fandatalist" :key="fans.areaId">
                <dl class="chart-wrapper">
                    <dt>
                        <router-link tag="p" :to="'/fan/details/fandetails/' + fans.areaId" class="link-details">
                            <!-- <img class="img" src="../../../assets/image/fengji_tubiao.png" alt=""> -->
                            <svg-icon icon-class="fan2" class-name="card-panel-icon"/>
                        </router-link>
                    </dt>
                    <dd>
                        <router-link tag="span" :to="'/fan/details/fandetails/' + fans.areaId" class="link-details">
                            {{fans.areaName}}
                        </router-link>
                    </dd>
                    <dd>
                        <router-link tag="p" :to="'/fan/details/fandetails/' + fans.areaId" class="link-details" :title="fantemptext[0] + ((fans.gearboxTemp === null) ? '': '  温度' + fans.gearboxTemp +'°C')"
                        style="display:block;overflow:hidden; white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis;cursor: pointer;">
                            {{fantemptext[0]}} 温度:{{fans.gearboxTemp}}°C
                        </router-link>
                    </dd>
                    <dd>
                        <router-link tag="p" :to="'/fan/details/fandetails/' + fans.areaId" class="link-details" :title="fantemptext[1] + ((fans.frequencyConverterTemp === null) ? '' : '  温度'+fans.frequencyConverterTemp+'°C')"
                        style="display:block;overflow:hidden; white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis;cursor: pointer;">
                            {{fantemptext[1]}} 温度:{{fans.frequencyConverterTemp}}°C
                        </router-link>
                    </dd>
                    <dd class="inline">
                        <router-link tag="p" :to="'/fan/details/fandetails/' + fans.areaId" class="link-details">
                            <span :class="fans.alarmAmount > 0 ? red : nomal">告警：{{fans.alarmAmount}}</span>
                        </router-link>
                    </dd>
                    <dd class="inline">
                        <router-link tag="p" :to="'/fan/details/fandetails/' + fans.areaId" class="link-details">
                        事件：{{fans.abnormalAmount}}
                        </router-link>
                    </dd>
                </dl>
            </el-col>
        </div>
    </div>
</template>

<script>
import { listFan } from "@/api/survey/fan/fan";

export default {
  // name: "fan",
  data() {
    return {
        fandatalist:[],
        red:"red",
        nomal:"nomal",
        fantemptext:[],
    }
  },
  created() {
    this.getfanlist();
  },
  methods: {
     /** 查询风机列表 */
    getfanlist(){
        this.getConfigKey('sys.fan.temptext').then(response => {
            console.log(response,'-----res')
            let text = response.msg;
            if (text.length > 0) {
                const msg = JSON.parse(text);
                this.fantemptext = msg.fan;
            }
        });
        listFan().then(response => {
            console.log(response,'风机列表');
            this.fandatalist = response.data;
        })
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container{
  background-color: rgb(240, 242, 245);
  min-height: calc(100vh - 100px);
  padding: 16px;
}
.chart-wrapper{
    border-radius: 10px;
}
.red{
    color: red;
    font-weight: normal !important;
}
.nomal{
    color: #515a6e;
    font-weight: normal !important;
}
.card-panel-icon{
    font-size: 110px;
    background: skyblue;
    border-radius: 50%;
    margin-bottom: 10px
}
.content{
    width: 100%;
    min-height: calc(100vh - 100px);
    dl{
        padding: 7%;
        text-align: center;
        background: #ffffff;
        margin-left: 10px;

        dt .img{
            width: 100%;
            margin-bottom: 5px;
        }
        dd{
            margin-top: 5px;
            font-size: 16px;
            line-height: 30px;
            span{
                font-weight: 700;
            }
            span:hover{
                cursor: pointer;
            }
        }
        .inline{
            width: 48%;
            display: inline-flex;
            flex-direction: column;
        }
    }
}
@media (max-width:1024px) {
    .clear{
        clear: both;
    }
    .content{
        display: float;
        .el-col{
            width: 49%;
            margin-bottom: 10px;
        }
    }
}
</style>
