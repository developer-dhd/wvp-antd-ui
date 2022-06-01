<template>
  <a-modal
    title="同步通道状态"
    width="240px"
    centered
    :visible="modalVisible"
    @cancel="modalCancel"
    :footer="null"
    :bodyStyle="{width: '100%',height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center'}">

    <a-progress
      type="circle"
      :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
      :percent="percentage"
      :status="syncStatus"/>

    <div v-if="syncStatus==='success'" style="color: #3caf36;font-weight: bold;margin-top: 10px">
      {{ msg }}
    </div>

    <div v-else-if="syncStatus==='exception'" style="color: #f5222d;font-weight: bold;margin-top: 10px">
      {{ msg }}
    </div>

    <div v-else style="color: #1890ff;font-weight: bold;margin-top: 10px">
      {{msg}}
    </div>

  </a-modal>
</template>

<script>
import {queryDeviceChannelSync} from "@/api/deviceList";

export default {
  name: "SyncChannelProgress",
  data() {
    return {
      modalVisible: false,
      percentage: 0,
      total: 0,
      current: 0,
      deviceId: null,
      syncFlag: false,
      syncStatus: '',
      timmer: null,
      msg: '正在同步'
    }
  },
  methods: {
    modalCancel() {
      this.modalVisible = false
      window.clearTimeout(this.timmer)
      this.$emit('refreshTable')
    },
    open(deviceId) {
      console.log("deviceId: " + deviceId)
      this.deviceId = deviceId
      this.modalVisible = true
      this.msg = '正在同步'
      this.percentage = 0
      this.total = 0
      this.current = 0
      this.syncFlag = false;
      this.syncStatus = 'normal';
      this.getProgress()
    },

    getProgress() {
      queryDeviceChannelSync({deviceId: this.deviceId}).then(res => {
          console.log(res)
          if (res.code === 0) {
            if (!this.syncFlag) this.syncFlag = true
            if (res.data != null) {
              if (res.data.total === 0) {
                if (res.data.errorMsg !== null) {
                  this.msg = res.data.errorMsg
                  this.syncStatus = "exception"
                } else {
                  this.msg = '等待同步中'
                  this.timmer = setTimeout(this.getProgress, 300)
                }
              } else {
                if (res.data.total === res.data.current) {
                  this.syncStatus = "success"
                  this.percentage = 100;
                  this.msg = '同步成功';
                } else {
                  if (res.data.errorMsg !== null) {
                    this.msg = res.data.errorMsg
                    this.syncStatus = "exception"
                  } else {
                    this.total = res.data.total;
                    this.current = res.data.current;
                    this.percentage = Math.floor(Number(res.data.current) / Number(res.data.total) * 10000) / 100;
                    this.msg = `同步中...[${res.data.current}/${res.data.total}]`;
                    this.timmer = setTimeout(this.getProgress, 300)
                  }
                }
              }
            }
          } else {
            if (this.syncFlag) {
              this.syncStatus = "success"
              this.percentage = 100;
              this.msg = '同步成功';
            } else {
              this.syncStatus = "exception"
              this.msg = res.msg;
            }
          }
        }
      ).catch(error => {
        this.syncStatus = "exception"
        this.msg = error.response.data.msg
      })
    }
  }
}
</script>

<style scoped>

</style>