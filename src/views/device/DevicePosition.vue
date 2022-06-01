<template>
  <div>
    <a-row v-if="onOff" :gutter="16">
      <a-col :span="6">
        <a-card :bordered="false" :body-style="{padding: '5px 15px'}">
          <div slot="title" style="width:100%; display: flex;align-items: center;justify-content: space-between">
            <span>设备列表</span>
            <a-button size="small" type="primary" icon="rollback" @click="handleBack">
              返回
            </a-button>
          </div>
          <div style="height: 40rem">
            <device-tree ref="deviceTree" :clickEvent="clickEvent" :contextMenuEvent="contextmenuEventHandler"/>
          </div>
        </a-card>
      </a-col>
      <a-col :span="18">
        <a-card :bordered="false" :body-style="{padding: '5px'}">
          <template slot="title">设备GPS位置</template>
          <div style="height: 40rem">
            <map-component ref="map"/>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <map-close v-if="!onOff"/>
    <div ref="infobox" v-if="channel != null " >
      <div v-if="channel != null" class="infobox-content">
        <a-descriptions class="margin-top" :title="channel.name" :column="1" :colon="true" size="small" >
          <a-descriptions-item label="编号">{{channel.channelId}}</a-descriptions-item>
          <a-descriptions-item label="型号">{{channel.model}}</a-descriptions-item>
          <a-descriptions-item label="经纬度">{{channel.longitude}},{{channel.latitude}}</a-descriptions-item>
          <a-descriptions-item label="生产厂商">{{channel.manufacture}}</a-descriptions-item>
          <a-descriptions-item label="行政区域">{{channel.civilCode}}</a-descriptions-item>
          <a-descriptions-item label="设备归属">{{channel.owner}}</a-descriptions-item>
          <a-descriptions-item label="安装地址">{{channel.address == null?'未知': channel.address}}</a-descriptions-item>
          <a-descriptions-item label="云台类型">{{channel.ptztypeText}}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag v-if="channel.status === 1" color="green">在线</a-tag>
            <a-tag v-if="channel.status === 0" color="grey">离线</a-tag>
          </a-descriptions-item>
        </a-descriptions>
        <div style="padding-top: 10px">
          <a-button type="primary" size="small" icon="caret-right" @click="play(channel)">视频播放</a-button>
          <a-button type="primary" size="small" icon="edit" style="margin-left: 10px" @click="edit(channel)">编辑位置</a-button>
          <a-button type="primary" size="small" icon="global" style="margin-left: 10px" @click="getTrace(channel)">轨迹查询</a-button>
        </div>
        <span class="infobox-close" @click="closeInfoBox()"><a-icon type="close-circle" /></span>
      </div>
    </div>
    <device-channel-player ref="deviceChannelPlayer"/>
    <query-trace ref="queryTrace"/>
  </div>

</template>

<script>
import DeviceTree from "./DeviceTree";
import MapComponent from "./MapComponent";
import DeviceChannelPlayer from './DeviceChannelPlayer'
import QueryTrace from "./QueryTrace";
import MapClose from "./MapClose"
import {mapParam} from "@/config/mapConfig";
import DeviceService from "@/api/DeviceService";

export default {
  name: 'DevicePosition',
  props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
  components: {
    DeviceTree,
    MapComponent,
    DeviceChannelPlayer,
    QueryTrace,
    MapClose
  },
  data() {
    return {
      onOff: typeof mapParam !== "undefined" && mapParam.enable,
      deviceService: new DeviceService(),
      infoBoxId: null,
      channel: null,
      layer: null,
      lineLayer: null,
    }
  },
  created() {

  },
  methods: {
    handleBack() {
      this.$emit('goBack')
    },

    clickEvent(data) {
      if (data.channelId && data.subCount === 0) {
        // 点击通道
        if (data.longitude * data.latitude === 0) {
          this.$message.error('未获取到位置信息');
        } else {
          if (this.layer != null) {
            this.$refs.map.removeLayer(this.layer);
          }
          this.closeInfoBox()
          this.layer = this.$refs.map.addLayer([{
            position: [data.longitude, data.latitude],
            image: {
              src: this.getImageByChannel(data),
              anchor: [0.5, 1]
            },
            data: data
          }], this.featureClickEvent)
          this.$refs.map.panTo([data.longitude, data.latitude], mapParam.maxZoom)
        }
      }
    },

    closeInfoBox: function () {
      if (this.infoBoxId != null) {
        this.$refs.map.closeInfoBox(this.infoBoxId)
      }
    },

    getImageByChannel(channel) {
      let src = "@/assets/gis/camera.png"
      switch (channel.ptztype) {
        case 1:
          if (channel.status === 1) {
            src = "@/assets/gis/camera1.png"
          } else {
            src = "@/assets/gis/camera1-offline.png"
          }
          break;
        case 2:
          if (channel.status === 1) {
            src = "@/assets/gis/camera2.png"
          } else {
            src = "@/assets/gis/camera2-offline.png"
          }
          break;
        case 3:
          if (channel.status === 1) {
            src = "@/assets/gis/camera3.png"
          } else {
            src = "@/assets/gis/camera3-offline.png"
          }
          break;
        default:
          if (channel.status === 1) {
            src = "@/assets/gis/camera.png"
          } else {
            src = "@/assets/gis/camera-offline.png"
          }
      }
      return src;
    },

    featureClickEvent(channels) {
      this.closeInfoBox()
      if (channels.length > 0) {
        this.channel = channels[0]
      }
      this.$nextTick(() => {
        this.infoBoxId = this.$refs.map.openInfoBox([this.channel.longitude, this.channel.latitude], this.$refs.infobox, [0, -50])
      })
    },

    contextmenuEventHandler(event, data) {
      if (data.channelId && data.subCount === 0) {
        // 点击通道
        this.$contextmenu({
          items: [
            {
              label: "播放",
              icon: "el-icon-video-play",
              disabled: false,
              onClick: () => {
                this.play(data);
              }
            },
            {
              label: "编辑位置",
              icon: "el-icon-edit",
              disabled: false,
              onClick: () => {
                this.edit(data)
              }
            },
            {
              label: "轨迹查询",
              icon: "el-icon-map-location",
              disabled: false,
              onClick: () => {
                this.getTrace(data)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: "custom-class", // 自定义菜单 class
          zIndex: 3000, // 菜单样式 z-index
        });
      } else {
        if (typeof data.channelId === "undefined") {
          this.deviceOrSubChannelMenu(event, data)
        } else {
          // TODO 子目录暂时不支持查询他下面所有设备, 支持支持查询直属于这个目录的设备
          this.deviceOrSubChannelMenu(event, data)
        }
      }
    },

    deviceOrSubChannelMenu(event, data) {
      // 点击设备
      this.$contextmenu({
        items: [
          {
            label: "定位",
            icon: "el-icon-s-promotion",
            disabled: false,
            onClick: () => {
              if (!data.channelId) {
                this.deviceService.getAllChannel(false, false, data.deviceId, this.channelsHandler)
              }
              if (data.channelId && data.subCount > 0) {
                // 点击子目录
                this.deviceService.getAllSubChannel(false, data.deviceId, data.channelId, this.channelsHandler)
              }
            }
          }
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 3000, // 菜单样式 z-index
      });

    },

    channelsHandler: function (channels) {
      console.log(2)
      if (channels.length > 0) {
        this.clean()
        this.closeInfoBox()
        let params = [];
        for (let i = 0; i < channels.length; i++) {
          if (channels[i].longitude * channels[i].latitude === 0) {
            continue;
          }
          let item = {
            position: [channels[i].longitude, channels[i].latitude],
            image: {
              src: this.getImageByChannel(channels[i]),
              anchor: [0.5, 1]
            },
            data: channels[i]
          }
          params.push(item);
        }
        console.log(3)
        this.layer = this.$refs.map.addLayer(params, this.featureClickEvent)
        console.log(4)
        if (params.length === 1) {
          this.$refs.map.panTo([channels[0].longitude, channels[0].latitude], mapParam.maxZoom)
        } else if (params.length > 1) {
          this.$refs.map.fit(this.layer)
        } else {
          this.$message.error('未获取到位置信息');
        }
      } else {
        this.$message.error('未获取到位置信息');
      }
    },

    play(channel) {
      console.log('通知设备推流：' + channel.deviceId + ' : ' + channel.channelId)
      this.$refs.deviceChannelPlayer.openDialog(channel)
    },
    edit(data) {
      this.$message.warning('暂不支持');
    },
    getTrace(data) {
      this.clean()
      this.$refs.queryTrace.openDialog(data, (channelPositions) => {
        console.log("getTrace")
        console.log(channelPositions)
        if (channelPositions.length === 0) {
          this.$message.success('未查询到轨迹信息');
        } else {
          let positions = [];
          for (let i = 0; i < channelPositions.length; i++) {
            if (channelPositions[i].cnLng * channelPositions[i].cnLat > 0) {
              positions.push([channelPositions[i].cnLng, channelPositions[i].cnLat])
            }

          }
          if (positions.length === 0) {
            this.$message.success('未查询到轨迹信息');
            return;
          }
          this.lineLayer = this.$refs.map.addLineLayer(positions)
          this.$refs.map.fit(this.lineLayer)
        }
      })
    },

    clean() {
      if (this.lineLayer != null) {
        this.$refs.map.removeLayer(this.lineLayer)
      }
      if (this.infoBoxId != null) {
        this.$refs.map.closeInfoBox(this.infoBoxId)
      }
      if (this.layer != null) {
        this.$refs.map.removeLayer(this.layer)
      }
    }
  }
}
</script>

<style scoped>
.infobox-content{
  position: relative;
  width: 20.5%;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #e2e2e2;
}

.infobox-content::after {
  position: absolute;
  bottom: -11px;
  left: 130px;
  display: block;
  content: "";
  width: 16px;
  height: 16px;
  background: url('~@/assets/arrow.png') no-repeat center;
}

.infobox-close {
  position: absolute;
  right: 0.5rem;
  top: 0.3rem;
  color: #000000;
  cursor:pointer
}
</style>
