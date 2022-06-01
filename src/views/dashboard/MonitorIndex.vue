<template>
  <div>
    <component @goMediaPage="handleMediaInfo" @goSipPage="handleSIPInfo" @goBack="handleGoBack" :mediaInfo="mediaInfo"
               :sipInfo="sipInfo" :is="currentComponent"></component>
  </div>
</template>

<script>
import MediaInfo from "./MediaInfo";
import SIPInfo from "./SIPInfo";
import Monitor from "./Monitor";

export default {
  name: "MonitorIndex",
  components: {
    MediaInfo,
    SIPInfo,
    Monitor
  },
  data() {
    return {
      currentComponent: 'Monitor',
      mediaInfo: {},
      sipInfo: {}
    }
  },
  methods: {
    handleMediaInfo(mediaInfo) {
      this.mediaInfo = mediaInfo || {}
      this.currentComponent = 'MediaInfo'
    },
    handleSIPInfo(sipInfo) {
      this.sipInfo = sipInfo || {}
      this.currentComponent = "SIPInfo"
    },
    handleGoBack() {
      this.mediaInfo = {}
      this.sipInfo = {}
      this.currentComponent = "Monitor"
    }
  }
}
</script>

<style scoped>

</style>
