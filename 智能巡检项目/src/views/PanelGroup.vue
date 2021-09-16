<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :span="24 / subtitles.length" class="panel-group" v-for="(item, index) in subtitles">
      <div :class="colors[index]" @click="clickPanel(index)">
        <el-row style="font-size: 16px; line-height: 40px;">{{item}}</el-row>
<!--        <el-row style="height: 20px;">-->
<!--          <span style="font-size: 14px;">当日事件</span>-->
<!--          <span style="font-size: 20px; margin-left: 10px;">{{counts[index * 4]}}</span>-->
<!--        </el-row>-->
<!--        <el-row style="height: 20px;">-->
<!--          <span style="font-size: 14px">昨日事件</span>-->
<!--          <span style="font-size: 20px; margin-left: 10px;">{{counts[index * 4 + 1]}}</span>-->
<!--        </el-row>-->
        <el-row>
          <span style="font-size: 14px;">当日告警</span>
          <span style="font-size: 20px; margin-left: 10px;">{{counts[index * 4 + 2]}}</span>
        </el-row>
        <el-row>
          <span style="font-size: 14px">昨日告警</span>
          <span style="font-size: 20px; margin-left: 10px;">{{counts[index * 4 + 3]}}</span>
        </el-row>
        <svg-icon :icon-class="icons[index]"
                  style="width: 50px; height: 50px; float: right; position: relative; right: 30px; top: -80px;"/>
      </div>
    </el-col>
  </el-row>
</template>

<script>

  export default {
    props: {
      subtitles: {
        type: Array,
        default: {}
      },
      counts: {
        type: Array,
        default: {}
      },
      links: {
        type: Array,
        default: []
      },
      icons: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        colors: [
          'panel orange',
          'panel blue',
          'panel yellow',
          'panel green'
        ]
      }
    },
    created() {
    },
    methods: {
      clickPanel(index) {
        this.$router.push({ path: this.links[index] })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    height: 140px;

    .panel {
      border-radius: 10px;
      height: 140px;
      opacity: 0.9;
      cursor: pointer;
      padding-top: 20px;
      padding-left: 30px;
      color: white;
      text-align: left;

      .panel-col {
        text-align: right;
        padding-right: 20px;
        padding-top: 5px;
      }

    }

    .orange {
      background: linear-gradient(#fb7053, #fa8b66);
    }

    .blue {
      background: linear-gradient(#4ba3f7, #5fbbfa);
    }

    .yellow {
      background: linear-gradient(#ffc755, #ffdf55);
    }

    .green {
      background: linear-gradient(#3ad7b8, #5be9cd);
    }
  }
</style>
