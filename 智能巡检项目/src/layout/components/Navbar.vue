<template>
  <div class="navbar">
    <el-row>
      <el-col :span="8">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <!-- <alarm-title class="alarm-title"></alarm-title> -->

      </el-col>

      <el-col :span="8">

        <alarm-carousel style="margin-top: 15px;"/>

      </el-col>

      <el-col :span="8">

        <div class="right-menu">
          <template v-if="device!=='mobile'">
            <search id="header-search" class="right-menu-item" />

<!--            IE兼容性问题取消全屏按钮，用户可通过F11键切换全屏/退出全屏-->
<!--            <screenfull id="screenfull" class="right-menu-item hover-effect" />-->

            <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
              <size-select id="size-select" class="right-menu-item hover-effect" />
            </el-tooltip> -->

          </template>

          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
            <div class="avatar-wrapper">
<!--              为支持IE暂时取消头像 <img :src="avatar" class="user-avatar">-->
              <span style="font-size: 14px;">{{$store.state.user.name}} 欢迎你</span>
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided v-if="$store.state.user.sso!==null&&$store.state.user.sso['superordinateSystem']!==undefined" @click.native="goToAnother(0)">
                <span>返回集控系统</span>
              </el-dropdown-item>
              <el-dropdown-item divided v-if="$store.state.user.sso!==null&&$store.state.user.sso['jzjk']!==undefined" @click.native="goToAnother(1)">
                <span>进入辅控系统</span>
              </el-dropdown-item>
              <!-- 为了解决在IE中不可以退出当前的“系统布局配置”页面 -->
              <el-dropdown-item v-if="false" @click.native="setting = true">
                <span>布局设置</span>
              </el-dropdown-item>
              <!--  -->
              <el-dropdown-item divided @click.native="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </el-col>

    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { getToken } from "@/utils/auth";
import AlarmCarousel from './AlarmCarousel'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    AlarmCarousel,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/index');
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    },
    // type: 0=>集控 1=>辅控
    goToAnother(type) {
      const sso = this.$store.state.user.sso
      const t = new Date().getTime()
      if (type === 0) {
        window.location.href = sso['superordinateSystem'] + "?t=" + t
      } else {
        window.location.href = sso['jzjk'] + "?authorizationCode="+getToken()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .alarm-title{
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 50px;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
