<template>
  <a-modal title="录像播放" :visible="showVideoModal" :width="900" @cancel="cancel" :footer="null" :bodyStyle="{padding:0}">
    <div ref="container" @dblclick="fullscreenSwitch"
         style="width:900px;height:506px;background-color: #000000;margin:0 auto; position: relative">
      <div class="buttons-box" id="buttonsBox">
        <div class="buttons-box-left">
          <i v-if="!playing" class="iconfont icon-play jessibuca-btn" @click="playBtnClick"></i>
          <i v-if="playing" class="iconfont icon-pause jessibuca-btn" @click="pause"></i>
          <i class="iconfont icon-stop jessibuca-btn" @click="destroy"></i>
          <i v-if="isNotMute" class="iconfont icon-audio-high jessibuca-btn" @click="jessibuca.mute()"></i>
          <i v-if="!isNotMute" class="iconfont icon-audio-mute jessibuca-btn" @click="jessibuca.cancelMute()"></i>
        </div>
        <div class="buttons-box-right">
          <a-dropdown class="jessibuca-btn" :placement="'topLeft'">
            <span>倍速</span>
            <a-menu slot="overlay" @click="gbScale">
              <a-menu-item key="0.25">
                <span>0.25x</span>
              </a-menu-item>
              <a-menu-item key="0.5">
                <span>0.5x</span>
              </a-menu-item>
              <a-menu-item key="1.0">
                <span>1.0x</span>
              </a-menu-item>
              <a-menu-item key="2.0">
                <span>2.0x</span>
              </a-menu-item>
              <a-menu-item key="4.0">
                <span>4.0x</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span class="jessibuca-btn">{{ kBps }} kb/s</span>
          <!--          <i class="iconfont icon-file-record1 jessibuca-btn"></i>-->
          <!--          <i class="iconfont icon-xiangqing2 jessibuca-btn" ></i>-->
          <i class="iconfont icon-camera1196054easyiconnet jessibuca-btn" @click="jessibuca.screenshot('截图','png',0.5)"
             style="font-size: 1rem !important"></i>
          <i class="iconfont icon-shuaxin11 jessibuca-btn" @click="playBtnClick"></i>
          <i v-if="!fullscreen" class="iconfont icon-weibiaoti10 jessibuca-btn" @click="fullscreenSwitch"></i>
          <i v-if="fullscreen" class="iconfont icon-weibiaoti11 jessibuca-btn" @click="fullscreenSwitch"></i>
        </div>
      </div>
    </div>
    <HKTimeLine :init-date="initTime" :time-data="timeData" @timeCallback="gbSeek"/>
  </a-modal>
</template>

<script>
import {
  pausePlayback,
  resumePlayback,
  setPlaybackGbSeek,
  setPlaybackSpeed,
  startPlayRecord,
  stopPlayRecord
} from "@/api/deviceList";
import HKTimeLine from "@/views/device/HKTimeLine";
import moment from "moment";

export default {
  name: 'RecordPlayer',
  components: {
    HKTimeLine
  },
  data() {
    return {
      videoUrl: '',
      showVideoModal: false,
      jessibuca: null,
      playing: false,
      isNotMute: false,
      quieting: false,
      fullscreen: false,
      loaded: false, // mute
      speed: 0,
      performance: "", // 工作情况
      kBps: 0,
      btnDom: null,
      videoInfo: null,
      volume: 1,
      rotate: 0,
      vod: true, // 点播
      forceNoOffscreen: false,
      streamId: '',
      deviceRow: null,
      timeData: [],
      startTime: '',
      endTime: '',
      initTime: '',
      hasAudio: false,
    };
  },

  watch: {
    videoUrl(newData, oldData) {
      this.play(newData)
    },
    immediate: true
  },
  methods: {
    moment,
    openDialog(recordRow, deviceRow) {
      this.startTime = recordRow.startTime
      this.initTime = this.startTime
      this.endTime = recordRow.endTime
      this.timeData = []
      this.timeData.push({startTime: this.startTime, endTime: this.endTime})
      this.deviceRow = deviceRow
      this.showVideoModal = true
      this.playRecord()
    },

    playRecord() {
      if (this.playing) {
        this.stopPlayRecord(() => {
          this.playing = false
          this.playRecord()
        })
      } else {
        let params = {
          deviceId: this.deviceRow.deviceId,
          channelId: this.deviceRow.channelId,
          startTime: this.startTime,
          endTime: this.endTime
        }
        startPlayRecord(params).then(streamInfo => {
          this.streamId = streamInfo.stream
          this.videoUrl = this.getUrlByStreamInfo(streamInfo)
        })
      }
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

    stopPlayRecord(callback) {
      stopPlayRecord({
        deviceId: this.deviceRow.deviceId,
        channelId: this.deviceRow.channelId,
        streamId: this.streamId
      }).then(res => {
        if (callback) callback()
      })
    },

    cancel() {
      console.log('关闭视频')
      if (this.playing) {
        this.stopPlayRecord()
      }
      if (this.jessibuca) {
        this.jessibuca.destroy()
        this.jessibuca = null
      }
      this.playing = false;
      this.loaded = false;
      this.performance = "";
      this.showVideoModal = false
    },
    create() {
      let options = {};
      console.log("hasAudio  " + this.hasAudio)
      this.jessibuca = new window.Jessibuca(Object.assign(
        {
          container: this.$refs.container,
          videoBuffer: 0.2, // 最大缓冲时长，单位秒
          isResize: true,
          decoder: "/jessibuca/decoder.js",
          useMSE: true,
          showBandwidth: false,
          isFlv: true,
          loadingText: "加载中",
          hasAudio: typeof (this.hasAudio) == "undefined" ? true : this.hasAudio,
          debug: false,
          supportDblclickFullscreen: false, // 是否支持屏幕的双击事件，触发全屏，取消全屏事件。
          vod: this.vod,
          forceNoOffscreen: this.forceNoOffscreen,
          isNotMute: this.isNotMute,
        },
        options
      ));

      let _this = this;
      this.jessibuca.on("load", function () {
        console.log("on load init");
      });

      this.jessibuca.on("log", function (msg) {
        console.log("on log", msg);
      });
      this.jessibuca.on("record", function (msg) {
        console.log("on record:", msg);
      });
      this.jessibuca.on("pause", function () {
        _this.playing = false;
      });
      this.jessibuca.on("play", function () {
        console.log('play')
        _this.playing = true;
      });
      this.jessibuca.on("fullscreen", function (msg) {
        console.log("on fullscreen", msg);
        _this.fullscreen = msg
      });

      this.jessibuca.on("mute", function (msg) {
        console.log("on mute", msg);
        _this.isNotMute = !msg;
      });
      this.jessibuca.on("audioInfo", function (msg) {
        // console.log("audioInfo", msg);
      });

      this.jessibuca.on("videoInfo", function (msg) {
        // this.videoInfo = msg;
        console.log("videoInfo", msg);

      });

      this.jessibuca.on("bps", function (bps) {
        // console.log('bps', bps);

      });
      let _ts = 0;
      this.jessibuca.on("timeUpdate", function (ts) {
        console.log('timeUpdate,old,new,timestamp', _ts, ts, ts - _ts);
        _ts = ts;
      });

      this.jessibuca.on("error", function (error) {
        console.log("error", error);
      });

      this.jessibuca.on("timeout", function () {
        console.log("timeout");
      });

      this.jessibuca.on('start', function () {
        console.log('start');
      })

      this.jessibuca.on("performance", function (performance) {
        let show = "卡顿";
        if (performance === 2) {
          show = "非常流畅";
        } else if (performance === 1) {
          show = "流畅";
        }
        _this.performance = show;
      });
      this.jessibuca.on('buffer', function (buffer) {
        // console.log('buffer', buffer);
      })

      this.jessibuca.on('stats', function (stats) {
        //console.log('stats', stats);
        //console.log(stats.ts / 1000);
      })

      this.jessibuca.on('kBps', function (kBps) {
        _this.kBps = Math.round(kBps);
      });

      // 显示时间戳 PTS
      this.jessibuca.on('videoFrame', function (frame) {
        //console.log(frame)
      })

      //
      this.jessibuca.on('metadata', function () {

      });
    },

    playBtnClick(event) {
      this.play(this.videoUrl)
    },

    play(url) {
      console.log('播放地址: ' + url)
      if (this.jessibuca) this.destroy()
      this.create()
      //this.gbPlay() //恢复国标推流播放
      this.jessibuca.on("play", () => {
        this.playing = true;
        this.loaded = true;
        this.quieting = this.jessibuca.quieting;
      });
      if (this.jessibuca.hasLoaded()) {
        this.jessibuca.play(url)
      } else {
        this.jessibuca.on("load", () => {
          console.log("load 播放")
          this.jessibuca.play(url);
        });
      }
    },

    pause() {
      if (this.jessibuca) {
        this.jessibuca.pause()
        //this.gbPause() //暂定国标流
      }
      this.playing = false;
      this.err = "";
      this.performance = ""
    },

    destroy() {
      if (this.jessibuca) {
        this.jessibuca.destroy();
      }
      if (document.getElementById("buttonsBox") == null) {
        this.$refs.container.appendChild(this.btnDom)
      }
      this.jessibuca = null;
      this.playing = false;
      this.err = "";
      this.performance = "";

    },
    eventcallbacK(type, message) {
      // console.log("player 事件回调")
      // console.log(type)
      // console.log(message)
    },

    fullscreenSwitch() {
      let isFull = this.isFullscreen()
      this.jessibuca.setFullscreen(!isFull)
      this.fullscreen = !isFull;
    },

    isFullscreen() {
      return document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement || false;
    },

    gbPause() {
      console.log('前端控制：暂停');
      pausePlayback({streamId: this.streamId}).then(res => console.log(res))
    },

    gbPlay() {
      console.log('前端控制：播放');
      resumePlayback({streamId: this.streamId}).then(res => console.log(res))
    },

    gbScale({key}) {
      console.log('前端控制倍速 ' + key);
      let params = {
        command: key,
        streamId: this.streamId
      }
      setPlaybackSpeed(params).then(res => this.$message.info(res.msg))
    },

    gbSeek(val) {
      console.log('选择的时间：' + val)
      //比较时间是不是在开始结束时间范围内
      let currentTime = new Date(val).getTime()
      let startTimeTemp = new Date(this.startTime).getTime()
      let endTimeTemp = new Date(this.endTime).getTime()
      console.log('总时间的seekTime(毫秒): ' + (endTimeTemp - startTimeTemp))
      if (currentTime > endTimeTemp || currentTime < startTimeTemp) {
        this.$message.error('选择的时间不在录像时间范围内')
        return
      }
      let seekTimeTemp = Math.floor((currentTime - startTimeTemp) / 1000)
      console.log('选择时间的seekTime(秒)：' + seekTimeTemp)
      let params = {
        streamId: this.streamId,
        seekTime: seekTimeTemp
      }
      setPlaybackGbSeek(params).then(res => {
        console.log(res)
        let _this = this
        setTimeout(() => _this.play(_this.videoUrl), 600)
      })
    }
  },
}
</script>

<style>
.buttons-box {
  width: 100%;
  height: 28px;
  background-color: rgba(43, 51, 63, 0.7);
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  left: 0;
  bottom: 0;
  user-select: none;
  z-index: 10;
}

.jessibuca-btn {
  width: 20px;
  color: rgb(255, 255, 255);
  line-height: 27px;
  margin: 0px 10px;
  padding: 0px 2px;
  cursor: pointer;
  text-align: center;
  font-size: 0.8rem !important;
}

.buttons-box-right {
  position: absolute;
  right: 0;
}
</style>