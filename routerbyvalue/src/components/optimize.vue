<template>
    <div class="optimize">
        <el-container>
            <el-header>优化 if-else</el-header>
            <el-main>
                <p>例：new Date().getDay()是从0开始，0-6；</p>
                <h1> 初级：</h1>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">1、第一种方法if-else：{{firstweek}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">2、第二种方法switch（注意: switch语句在比较值的时候使用的是全等操作符，不会有类型转换的情况）：{{secondweek}}</div>
                    </el-col>
                </el-row>
                <h1> 中级：使用数组或者对象优化 </h1>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">1、用数组的下标index：{{thirdweek}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">2、用对象：{{fourthweek}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">3、用字符串（使用 charAt 字符方法）：{{fifthweek}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">{{weekobj}}</div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
export default {
    data(){
        return{
            firstweek:'',
            secondweek:'',
            thirdweek:'',
            fourthweek:'',
            fifthweek:'',
            weekobj:{}
        }
    },
    mounted(){
        this.FirstMethod();
        this.SecondMethod();
        this.ThirdMethod();
        this.FourthMethod();
        this.FifthMethod();
        this.SixthMethod();
    },
    methods:{
        FirstMethod(){
            let msg = '今天是星期';
            let date = new Date().getDay();
            if(date === 0){
                msg += '日';
            }else if(date === 1){
                msg += '一';
            }else if(date === 2){
                msg += '二';
            }else if(date === 3){
                msg += '三';
            }else if(date === 4){
                msg += '四';
            }else if(date === 5){
                msg += '五';
            }else if(date === 6){
                msg += '六';
            }
            this.firstweek = msg;
            console.log(this.firstweek,'第一种方法');
            return this.firstweek;
        },
        SecondMethod(){
            let msg = '今天是星期';
            let date = new Date().getDay();
            switch(date){
                case 0 :
                    msg += '日';
                    break;
                case 1 :
                    msg += '一';
                    break;
                case 2 :
                    msg += '二';
                    break;
                case 3 :
                    msg += '三';
                    break;
                case 4 :
                    msg += '四';
                    break;
                case 5 :
                    msg += '五';
                    break;
                case 6 :
                    msg += '六';
                    break;
            }
            this.secondweek = msg;
            console.log(this.secondweek,'第二种方法');
            return this.secondweek;
        },
        ThirdMethod(){
            let msg = '今天是星期';
            let date = new Date().getDay();
            let dateArr = ['日','一','二','三','四','五','六'];
            msg += dateArr[date];
            this.thirdweek = msg;
            console.log(this.thirdweek,'第三种方法');
            return this.thirdweek;
        },
        FourthMethod(){
            let msg = '今天是星期';
            let date = new Date().getDay();
            let obj = {
                0:'天',
                1:'一',
                2:'二',
                3:'三',
                4:'四',
                5:'五',
                6:'六'
            }
            this.fourthweek = msg + obj[date];
            console.log(this.fourthweek,'第四种方法');
            return this.fourthweek;
        },
        FifthMethod(){
            let msg = '今天是星期';
            this.fifthweek = msg + '日一二三四五六'.charAt(new Date().getDay());
        },
        SixthMethod(){
            let msg = '今天是星期';
            let date = new Date().getDay();
            let objdata = {
                0:['天','休'],
                1:['一','工'],
                2:['二','工'],
                3:['三','工'],
                4:['四','工'],
                5:['五','工'],
                6:['六','休'],
            }
            let objType = {
                '休':function(){
                    console.log('休息日')
                },
                '工':function(){
                    console.log('工作日')
                }
            }
            let returndata = {
                'week':msg + objdata[date][0],
                'types':objType[objdata[date][1]]
            }
            console.log(objType)
            this.weekobj = returndata;
            console.log(this.weekobj);
            return this.weekobj;
        },
    },
}
</script>
<style scoped>
 .el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  font-size: 36px;
}
.el-aside {
  background-color: #D3DCE6;
  color: #333;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
}
.el-main p{
  text-align: left;
  cursor: pointer;
}

.el-row {
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
  line-height: 40px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>