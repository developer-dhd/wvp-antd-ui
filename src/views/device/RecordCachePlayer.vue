<template>
  <a-modal
    title="视频播放"
    :visible="isShowPlayer"
    :width="900"
    :confirmLoading="false"
    :footer="null"
    size="small"
    @cancel="close()">
    <live-player ref="recordPlayer" :videoUrl="videoUrl" custom-buttons="对讲" fluent autoplay live/>
    <a-card v-if="isRecording" size="small" style="margin-top: 15px">
      <span slot="title" style="display: flex; justify-content: space-between;align-items: center">
        <span>{{ titleMark }}</span>
        <a-button type="danger" @click="download">停止并下载</a-button>
      </span>
      <a-progress :stroke-color="{'0%': '#108ee9','100%': '#87d068'}" :percent="percentage"/>
    </a-card>
    <p v-if="isRecording" style="margin-top: 1rem;margin-bottom: 0; padding: 0;">
      <font-awesome-icon :icon="['fas', 'exclamation-triangle'] " style="color: red;margin-right: 0.25rem"/>
      注意：缓存的是硬盘录像机上的录像，当前流名称：<code style="color: #f5222d">{{ streamId }}</code>，
      关闭窗口后请到"云端录像-NVR缓存录像列表"中根据流名称自由合并视频或查看视频合成记录。
    </p>
  </a-modal>

</template>

<script>

import LivePlayer from '@liveqing/liveplayer'
import {
  downloadRecord,
  getFileDownload,
  getProgressForFile,
  getProgressRequest,
  stopDownloadRecord
} from '@/api/deviceList'

export default {
  name: 'RecordCachePlayer',
  props: {},
  components: {
    LivePlayer
  },
  created() {
  },
  data() {
    return {
      videoUrl: '',
      isShowPlayer: false,
      recordRow: null,
      deviceRow: null,
      isRecording: false,
      streamId: '',
      app: '',
      mediaServerId: '',
      getProgressRun: false,
      percentage: 0.00,
      titleMark: '录像正在四倍速下载中',
      taskId: null,
      getProgressForFileRun: false,
      streamInfo: null
    }
  },
  methods: {
    openDialog(recordRow, deviceRow) {
      console.log(recordRow, deviceRow)
      this.isShowPlayer = true
      this.recordRow = recordRow
      this.deviceRow = deviceRow
      this.getProgressRun = true
      this.percentage = 0.0
      this.downloadRecord()
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

    downloadRecord() {
      if (this.isRecording) {
        this.stopDownloadRecord(() => {
          this.isRecording = false
          this.downloadRecord()
        })
      } else {
        let params = {
          deviceId: this.deviceRow.deviceId,
          channelId: this.deviceRow.channelId,
          startTime: this.recordRow.startTime,
          endTime: this.recordRow.endTime,
          downloadSpeed: 4
        }
        downloadRecord(params).then(res => {
          if (res.code === 0) {
            let streamInfo = res.data;
            this.streamId = streamInfo.stream
            this.app = streamInfo.app
            this.mediaServerId = streamInfo.mediaServerId
            this.isRecording = true
            this.videoUrl = this.getUrlByStreamInfo(streamInfo)
            console.log(this.videoUrl)
            this.getProgressTimer()
          }
        })
      }
    },

    stopDownloadRecord(callback) {
      if (!callback) this.isRecording = false
      this.videoUrl = ''
      let params = {
        deviceId: this.deviceRow.deviceId,
        channelId: this.deviceRow.channelId,
        streamId: this.streamId
      }
      stopDownloadRecord(params).then(res => {
        console.log('stopDownloadRecord: ' + JSON.stringify(res))
        if (callback) callback()
      })
    },

    getProgressTimer() {
      if (!this.getProgressRun) return
      if (this.percentage === 100) {
        this.getFileDownload()
        return
      }
      setTimeout(() => {
        if (!this.isShowPlayer) return
        this.getProgress(this.getProgressTimer())
      }, 5000)
    },

    getProgress(callback) {
      let params = {
        deviceId: this.deviceRow.deviceId,
        channelId: this.deviceRow.channelId,
        streamId: this.streamId
      }
      getProgressRequest(params).then((data) => {
        console.log(data)
        console.log(data.progress)
        this.streamInfo = data
        if (data.progress === 1 || parseFloat(data.progress) === 1) {
          this.percentage = 100
        } else if (data.progress > 0 || parseFloat(data.progress) > 0) {
          //this.percentage = (data.progress * 100).toFixed(1)
          this.percentage = Math.round(data.progress * 100)
        } else {
          this.percentage = 0
        }
        if (callback) callback()
      }).catch(e => console.log(e))
    },

    getFileDownload() {
      let params = {
        mediaServerId: this.mediaServerId,
        app: this.app,
        stream: this.streamId,
        startTime: null,
        endTime: null
      }
      getFileDownload(params).then((res) => {
        console.log('taskId: ' + JSON.stringify(res))
        if (res.code === 0 && res.msg === "success") {
          // 查询进度
          this.titleMark = "录像文件处理中"
          this.taskId = res.data
          this.percentage = 0.0
          this.getProgressForFileRun = true
          this.getProgressForFileTimer()
        }
      }).catch(error => console.log(error))
    },

    getProgressForFileTimer() {
      if (!this.getProgressForFileRun || this.percentage === 100) return
      setTimeout(() => {
        if (!this.isShowPlayer) return
        this.getProgressForFile(this.getProgressForFileTimer())
      }, 1000)
    },

    getProgressForFile(callback) {
      let params = {
        mediaServerId: this.mediaServerId,
        app: this.app,
        stream: this.streamId,
        taskId: this.taskId,
        isEnd: true,
      }
      getProgressForFile(params).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.percentage = parseFloat(res.data.percentage) * 100
          if (res.data[0].percentage === '1') {
            this.getProgressForFileRun = false
            window.open(res.data[0].downloadFile)
            this.close()
          } else {
            if (callback) callback()
          }
        }
      }).catch(error => console.log(error))
    },

    download() {
      this.getProgressRun = false
      if (this.streamInfo != null) {
        if (this.streamInfo.progress < 1) {
          // 发送停止缓存
          this.stopDownloadRecord((res) => {
            this.isRecording = false
            this.getFileDownload()
          })
        } else {
          this.getFileDownload()
        }
      }
    },

    close() {
      console.log('关闭视频')
      if (this.isRecording || (this.streamInfo && this.streamInfo.progress < 100)) {
        this.stopDownloadRecord()
      }
      this.isShowPlayer = false
      this.getProgressRun = false
      this.getProgressForFileRun = false
    }

  }
}
</script>

<style>
</style>
