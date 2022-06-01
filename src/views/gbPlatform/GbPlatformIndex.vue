<template>
  <div>
    <component
      @goPlatformListPage="goPlatformListPage"
      @goChannelShare="goChannelSharePage"
      @goGbPlatformEdit="goGbPlatformEdit"
      @goBack="handleGoBack"
      :model="model"
      :is="currentComponent">
    </component>
  </div>
</template>

<script>
// 动态切换组件
import GbPlatformList from "./GbPlatformList";
import ChannelSharePage from "./ChannelSharePage";
import GbPlatformEdit from "./GbPlatformEdit";

export default {
  name: 'DeviceListWrapper',
  components: {
    GbPlatformList,
    ChannelSharePage,
    GbPlatformEdit
  },
  data() {
    return {
      platformId: '',
      currentComponent: 'GbPlatformList',
      model: {}
    }
  },
  methods: {
    goPlatformListPage(){
      this.currentComponent = 'GbPlatformList'
    },
    goChannelSharePage(params){
      this.model = params
      this.currentComponent = 'ChannelSharePage'
    },
    goGbPlatformEdit(params){
      this.model = params
      this.currentComponent = 'GbPlatformEdit'
    },
    handleGoBack() {
      this.model = {}
      this.currentComponent = 'GbPlatformList'
    }
  },
  watch: {
    '$route.path'() {
      this.platformId = ''
      this.currentComponent = 'GbPlatformList'
    }
  }
}
</script>
