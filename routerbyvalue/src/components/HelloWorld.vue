<template>
  <div class="hello">
    <el-container>
      <el-header>vue组件间通信方式</el-header>
      <el-container>
        <el-aside width="240px">
          <h2>一、父子通信：</h2>
          <ul>
            <li>1、父向子传递数据是通过 props, 子向父是通过 events($emit);</li>
            <li>2、通过父链 / 子链也可以通信（$parent / $children）;</li>
            <li>3、ref 也可以访问组件实例;</li>
            <li>4、provide / inject API;</li>
            <li>5、$attrs/$listeners;</li>
          </ul>
          <h2>二、兄弟通信：</h2>
          <ul>
            <li>1、Bus;</li>
            <li>2、Vuex;</li>
          </ul>
          <h2>三、跨级通信：</h2>
          <ul>
            <li>1、Bus;</li>
            <li>2、Vuex;</li>
            <li>3、provide / inject ;</li>
            <li>4、$attrs / $listeners</li>
          </ul>
        </el-aside>
        <el-container>
          <el-main>
            <h1>方法一、props/$emit</h1>
            <router-link to="/UsersParent" tag="p">1.父组件向子组件传值: props</router-link>
            <router-link to="/Second" tag="p">2.子组件向父组件传值（通过事件形式）$emit</router-link>
            <h1>方法二、$emit/$on</h1>
            <router-link to="/Three" tag="p">这种方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级。</router-link>
            <h1>方法三、vuex</h1>
            <router-link to="/Four" tag="p">vuex详细分析</router-link>
            <h1>方法四、$attrs/$listeners</h1>
          </el-main>
          <el-footer>
            {{msg}}
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark"><router-link to="/optimize" tag="span">优化if-else</router-link></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      
    }
  },
  mounted(){
    
  },
  methods:{
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
ul{
  list-style: none;
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
  line-height: 50px;
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
