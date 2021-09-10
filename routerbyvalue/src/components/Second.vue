<template>
  <div id="second">
    <second-child v-on:titleChanged="updateTitle" ></second-child>
    <!-- 与子组件titleChanged自定义事件保持一致 -->
    <!-- updateTitle($event)接受传递过来的文字 -->

    <!-- <h1>方法一：props/$emit</h1> -->
    <p>2.子组件向父组件传值（通过事件形式）</p>
    <p>总结：子组件通过events给父组件发送消息，实际上就是子组件把自己的数据发送到父组件。</p>
    <h2>{{title}}</h2>
  </div>
</template>
<script>
import SecondChild from "./SecondChild"
export default {
  name: 'second',
  data(){
    return{
      title:"传递的是一个值"
    }
  },
  methods:{
    updateTitle(e){   //声明这个函数
      this.title = e;
    }
  },
  components:{
   "second-child":SecondChild,
  }
}
</script>