<template>
    <div class="threeb">
        <h3>B组件：{{age}}</h3>
        <button @click="send">将数组发送给C组件</button>
    </div>
</template>
<script>
// var Event = new Vue();
export default {
    data() {
      return {
        age: 20
      }
    },
    methods: {
      send() {
        this.$emit('data-b', this.age);
      }
    }
}
</script>
<style scoped>

</style>