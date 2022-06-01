<template>
  <a-modal
    title="视频播放"
    :visible="isShowPlayer"
    :width="900"
    :footer="null"
    :bodyStyle="{margin: 0, padding: 0}"
    @cancel="close()">
    <div :style="{'height': height+'px'}">
      <live-player :video-url="videoUrl" autoplay live fluent :hasaudio="hasAudio"/>
    </div>
  </a-modal>
</template>

<script>

import LivePlayer from "@liveqing/liveplayer";

export default {
  name: "PlayerDialog",
  components: {
    LivePlayer
  },
  props: {
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      hasAudio: false,
      videoUrl: '',
      isShowPlayer: false
    }
  },
  methods: {
    play(url, hasAudio) {
      this.isShowPlayer = true
      this.hasAudio = hasAudio
      this.videoUrl = url
    },
    close() {
      this.videoUrl = ''
      this.isShowPlayer = false
    }
  }
}
</script>

<style scoped>

</style>