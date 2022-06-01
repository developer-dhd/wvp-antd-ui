<template>
  <a-modal
    title="查询轨迹"
    width="40%"
    :visible="showDialog"
    :footer="null"
    @cancel="close()">
    <a-spin :spinning="isLoging" style="display: inline-flex; align-items: center; width: 100%; justify-content: center">
      <a-range-picker
        :ranges="{
              '今天':[moment(), moment().endOf('day')],
              '昨天': [moment().subtract(1,'days'), moment()],
              '上周': [moment().subtract(1,'weeks'), moment()],
              '上月': [moment().subtract(1,'months'), moment()]}"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        @change="onRangePickerChange"/>
      <a-button icon="search" type="primary" style="margin-left: 15px" @click="onSubmit">查询</a-button>
    </a-spin>
  </a-modal>
</template>

<script>
import DeviceService from "@/api/DeviceService";
import moment from "moment";
import {positionHistory} from "@/api/deviceList";

export default {
  name: "QueryTrace",
  props: [],
  computed: {},
  created() {
  },
  data() {
    return {
      deviceService: new DeviceService(),
      searchFrom: null,
      searchTo: null,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      channel: null,
      callback: null,
    };
  },
  methods: {
    moment,

    onRangePickerChange(dates, dateStrings) {
      this.searchFrom = dateStrings[0]
      this.searchTo = dateStrings[1]
    },

    openDialog(channel, callback) {
      console.log(channel)
      this.showDialog = true;
      this.callback = callback;
      this.channel = channel;
    },

    onSubmit() {
      console.log("onSubmit");
      this.isLoging = true;
      let params = {
        deviceId: this.channel.deviceId,
        channelId: this.channel.channelId,
        start: this.searchFrom,
        end: this.searchTo
      }
      positionHistory(params).then(res => {
        console.log(res)
        this.isLoging = false;
        if (typeof this.callback == "function") {
          if (res.code === 0) {
            this.callback(res.data)
            this.close()
          } else {
            this.$message.error(res.msg);
          }
        }
      }).catch((error) => {
        this.isLoging = false;
        console.error(error);
      })
    },
    close() {
      this.showDialog = false;
      this.isLoging = false;
      this.callback = null;
      this.channel = null;
    },
  },
};
</script>
