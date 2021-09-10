<template>
  <div class="hello">
    <!-- <h1>方法一：props/$emit</h1> -->
    <p>1.父组件向子组件传值: props</p>
    <p>总结：父组件通过props向下传递数据给子组件。注：组件中的数据共有三种形式：data、props、computed</p>
    <users v-bind:users="users"></users>  <!-- 前者自定义名称便于子组件调用，后者要传递数据名 -->
  </div>
</template>

<script>
import Users from "./Users"
export default {
  name: 'UsersParent',
  data () {
    return {
      users:["Henry","Bucky","Emily"]
    }
  },
  components:{
    "users":Users
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
