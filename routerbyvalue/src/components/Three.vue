<template>
    <div class="three">
        <h1>1、具体实现方式：</h1>  
        <div>
            var Event=new Vue();
            Event.$emit(事件名,数据);
            Event.$on(事件名,data => {});
        </div>
        <three-a v-on:dataA="dataA"></three-a>
        <three-b v-on:dataB="dataB"></three-b>
        <three-c></three-c>
        <!-- https://segmentfault.com/a/1190000019208626 -->
        <div>
            <img src="../assets/html.png" alt="">
            <img src="../assets/js.png" alt="">
        </div>
    </div>
</template>
<script>
import ThreeA from "./ThreeA"
import ThreeB from "./ThreeB"
import ThreeC from "./ThreeC"
export default {
  name: 'Three',
  data () {
    return {
        
    }
  },
  components:{
    ThreeA,
    ThreeB,
    ThreeC,
  },
  methods:{
      dataA:{

      },
      dataB:{

      }
  }
}
</script>
