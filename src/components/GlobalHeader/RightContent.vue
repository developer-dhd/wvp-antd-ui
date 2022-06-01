<template>
  <div :class="wrpCls">

    <div :class="prefixCls">
      <a-dropdown style="margin-left: 10px">
        <a> {{ userInfo.username }}</a>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <a href="javascript:void(0)" @click="logoutUser">安全退出</a>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="1">
            <a href="javascript:void(0)" @click="editPassword">修改密码</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import SelectLang from '@/components/SelectLang'

export default {
  name: 'RightContent',
  components: {
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMenu: true,
    }
  },
  computed: {
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    },
    ...mapGetters(['userInfo'])
  },
  methods: {
    editPassword() {
      console.log(this.userInfo)
      //this.$refs.editPasswordForm.open()
    },
    ...mapActions({
      logoutUser: 'Logout'
    })
  }
}
</script>
