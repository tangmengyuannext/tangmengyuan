<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="settings.logo" :src="settings.logo" class="sidebar-logo" :style="settings.style">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div v-if="settings.hasTitle">
          <img v-if="settings.logo" :src="settings.logo" class="sidebar-logo" :style="settings.style">
          <h1 class="sidebar-title">{{ title }} </h1>
        </div>
        <div v-else>
          <img v-if="settings.logo" :src="settings.logo" class="sidebar-logo" :style="settings.style">
          <h1 v-else class="sidebar-title">{{ title }} </h1>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
// import logoImg from '@/assets/logo/logo.png'
import { listConfig } from "@/api/system/config";
// import logoImg from '@/assets/logo/ztlogo.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '远程智能巡检系统',
      logo: '',
      settings: {
        hasTitle: true,
        style: {},
        logo: ''
      }
      // logo: "",
    }
  },
  created() {
    this.getLogo()
  },
  methods: {
    getLogo() {
      listConfig().then(response => {
        response.rows.map((v)=>{
          if(v.configKey == "sys.index.logoimg"){
            let configValue = JSON.parse(v.configValue)
            this.settings = {
              hasTitle: configValue.hasTitle === "true" ? true : false,
              style: configValue.style,
              logo: require('../../../assets/logo/' + configValue.logo)
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 5px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
