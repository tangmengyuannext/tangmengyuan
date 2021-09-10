<template>
    <div class="threea">
        <h3>A组件：{{name}}</h3>
        <button @click="send">将数据发送给C组件</button>
    </div>
</template>
<script>
// var Event = new Vue();
export default {
    data() {
      return {
        name: 'tom'
      }
    },
    methods: {
      send() {
        this.$emit('dataA', this.name);
      }
    }
}
</script>
<style scoped>

</style>