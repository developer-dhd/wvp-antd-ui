<template>
  <a-modal title="视频播放" :width="900" :visible="modalVisible" :footer="null" :closable="true" @cancel="cancel">
    <live-player :video-url="videoURL" autoplay fluent live stretch/>
  </a-modal>
</template>

<script>
import LivePlayer from "@liveqing/liveplayer";

export default {
  name: "ModalPlayer",
  components: {LivePlayer},
  data() {
    return {
      videoURL: '',
      modalVisible: false
    }
  },
  methods: {
    open(streamInfo){
      console.log(streamInfo)
      this.videoURL = this.getUrlByStreamInfo(streamInfo)
    },
    getUrlByStreamInfo(streamInfo){
      if (location.protocol === "https:") {
        if (streamInfo.wss_flv === null) {
          console.error("媒体服务器未配置ssl端口, 使用http端口")
          return streamInfo.ws_flv
        }else {
          return streamInfo.wss_flv;
        }
      }else {
        return streamInfo.ws_flv;
      }
    },
    cancel() {
      this.videoURL = ''
      this.modalVisible = false
    }
  }
}
</script>

<style scoped>

</style>