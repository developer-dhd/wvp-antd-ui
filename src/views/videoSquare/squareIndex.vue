<template>
  <div>
    <a-card :bordered="false" :body-style="{padding: 0,paddingTop:'1px'}">
      <div slot="title" style="width: 100%; display: inline-flex; align-items: center; justify-content: space-between">
        <div>
          分屏选择：
          <a-tooltip title="单屏">
            <i class="el-icon-full-screen splitBtn" title="单屏" :class="{active:spiltNum===1}" @click="spiltNum=1"/>
          </a-tooltip>
          <a-tooltip title="4分屏">
            <i class="iconfont icon-icon-screen-four splitBtn" :class="{active:spiltNum===4}" @click="spiltNum=4"/>
          </a-tooltip>
          <a-tooltip title="9分屏">
            <i class="iconfont icon-9fenping splitBtn" :class="{active:spiltNum===9}" @click="spiltNum=9"/>
          </a-tooltip>
          <a-tooltip title="16分屏">
            <i class="iconfont icon-icon-16fenping splitBtn" :class="{active:spiltNum===16}" @click="spiltNum=16"/>
          </a-tooltip>
        </div>
        <div>
          <a-button type="primary" @click="setFullscreen">电视墙模式</a-button>
        </div>
      </div>
      <a-row :gutter="0">
        <a-col :span="5">
          <device-tree :clickEvent="clickEvent" :contextMenuEvent="null"/>
        </a-col>
        <a-col :span="19">
          <div ref="fullScreenEl" style="width: 100%; height: 100%;background-color: #FFFFFF">
            <a-row :gutter="[2,2]" v-for="indexRow in rows" :key="indexRow">
              <a-col :span="colSpan" v-for="indexCol in cols" :key="indexCol">
                <div style="width: 100%; height: 100%" @click="getPlayerPos(indexRow, indexCol)">
                  <live-player
                      :video-url="videoUrl['player-'+indexRow + '-' + indexCol]"
                      :class="{playerActive: indexRow===playerRow && indexCol === playerCol}"
                      autoplay live fluent stretch/>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>

    </a-card>
  </div>
</template>

<script>
import DeviceTree from '@/views/construction_safety/video_monitor/device/DeviceTree'
import LivePlayer from "@liveqing/liveplayer";
import {noticePushStream} from "@/api/modular/construction_safety/video_monitor/deviceList";
import fscreen from 'fscreen'

export default {
  name: "squareIndex",
  components: {
    DeviceTree,
    LivePlayer
  },
  data() {
    return {
      spiltNum: 1,//分屏
      playerIdx: 0,//激活播放器
      videoUrl: {},
      rows: 1,
      cols: 1,
      colSpan: 24,
      playerRow: 1,
      playerCol: 1
    }
  },

  watch: {
    spiltNum(val) {
      console.log(val)
      let v = Math.sqrt(val)
      this.rows = v | 0
      this.cols = (v + 0.6) | 0
      this.colSpan = 24 / this.cols
    }
  },

  methods: {
    getPlayerPos(rowIndex, colIndex) {
      console.log(rowIndex, colIndex)
      this.playerRow = rowIndex
      this.playerCol = colIndex
    },

    clickEvent(data) {
      if (data.channelId && data.subCount === 0) {
        this.sendDevicePush(data)
      }
    },

    sendDevicePush(itemData) { // 通知设备上传媒体流
      if (itemData.status === 0) {
        this.$message.error('设备离线!');
        return
      }
      const deviceId = itemData.deviceId
      const channelId = itemData.channelId
      console.log('通知设备推流：' + deviceId + ' : ' + channelId)
      noticePushStream({deviceId: deviceId, channelId: channelId}).then(res => {
        if (res.code === 0) {
          let videoURL = this.getUrlByStreamInfo(res.data)
          this.videoUrl['player-' + this.playerRow + '-' + this.playerCol] = videoURL
          this.changeSelected()
        } else {
          console.log(res.msg)
          this.$message.error('点播失败, 请检查摄像机是否在线')
        }
      })
    },

    getUrlByStreamInfo(streamInfo) {
      if (location.protocol === 'https:') {
        if (streamInfo.wss_flv === null) {
          this.$message.error('媒体服务器未配置ssl端口')
        } else {
          return streamInfo.wss_flv
        }
      } else {
        return streamInfo.ws_flv
      }
    },

    changeSelected() {
      if (this.playerCol === this.cols) {
        this.playerRow++
      } else {
        this.playerCol++
      }
    },

    setFullscreen() {
      if (!fscreen.requestFullscreen) {
        this.$message.error('浏览器不支持全屏API')
        return
      }
      if (!fscreen.fullscreenEnabled) {
        this.$message.error("浏览器未开启全屏模式功能")
        return;
      }
      fscreen.requestFullscreen(this.$refs.fullScreenEl)
    }
  },

}
</script>

<style scoped>

.splitBtn {
  margin: 0 10px;
}

.splitBtn:hover {
  color: #409EFF;
}

.splitBtn.active {
  color: #409EFF;
}

.playerActive {
  border: 1px #f5222d solid;
}

</style>
