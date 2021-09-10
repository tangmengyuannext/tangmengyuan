<template>
    <div class="threec">
        <h3>C组件：{{name}}，{{age}}</h3>
    </div>
</template>
<script>
// var Event = new Vue();
export default {
    data() {
      return {
        name: '',
        age: ""
      }
    },
    mounted() {//在模板编译完成后执行
        let that = this;
        that.$on('data-a',name => {
            that.name = name;//箭头函数内部不会产生新的this，这边如果不用=>,this指代Event
        })
        that.$on('data-b',age => {
            that.age = age;
        })
    }
}
</script>
<style scoped>

</style>