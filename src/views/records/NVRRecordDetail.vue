<template>
  <div>
    <a-row :gutter="[16, 0]">
      <a-col :span="8">
        <a-card :bordered="false" style="margin-bottom: 0.5rem">
          <a-row :gutter="16">
            <a-col :span="12">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; ">
                <div>日期：</div>
                <a-date-picker v-model="chooseDate" placeholder="请选择日期" @change="dateChange">
                  <template slot="dateRender" slot-scope="current, today">
                    <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                      {{ current.date() }}
                    </div>
                  </template>
                  <template slot="renderExtraFooter">
                    <strong style="font-size: 12px;color: #f5222d">注意：蓝色圆圈代表当天有录像记录</strong>
                  </template>
                </a-date-picker>
              </div>
            </a-col>
            <a-col :span="12">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" style="margin-left: 8px" @click="videoCut">合成</a-button>
              <a-button style="margin-left: 8px" @click="handleGoBack">返回</a-button>
            </a-col>
          </a-row>
        </a-card>
        <a-card :bordered="false">
          <s-table
            ref="table"
            size="default"
            rowKey="key"
            :columns="columns"
            :data="loadData"
            showPagination="auto"
          >
            <span slot="operator" style="color: #f5222d"><a-icon type="warning"/> 列表仅展示最近10条记录，可以按照时间自行合并</span>
            <span slot="action" slot-scope="text, record">
              <a @click="playVideo(record)">播放</a>
              <a-divider type="vertical"/>
              <a :href="downloadUrl" target="_blank" @click="downloadVideo(record)">下载</a>
            </span>
          </s-table>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card :bordered="false">
          <div :style="playerStyle">
            <live-player :videoUrl="videoUrl" fluent autoplay :playback-rates="[0.5, 1, 2, 3]"></live-player>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      title="视频合成"
      placement="bottom"
      height="55%"
      :closable="true"
      :visible="drawerVisible"
      @close="drawerClose">
      <a-card align="center">
        选择需要进行视频合并的时间段：
        <a-range-picker show-time @change="rangePickerChange"/>
        <a-button type="primary" style="margin-left: 10px" @click="addTaskToServer">开始合并</a-button>
      </a-card>
      <a-tabs default-active-key="processing" @change="tabCallback">
        <a-tab-pane key="processing" tab="进行中">
          <a-table :data-source="taskListForRunning" :columns="taskRunningColumns" :pagination="{defaultPageSize: 3}">
             <span slot="startTime" slot-scope="text, record">
              {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span slot="endTime" slot-scope="text, record">
              {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span slot="status" slot-scope="text, record">
               <a-badge color="blue" text="进行中"/>
            </span>
            <span slot="process" slot-scope="text, record">
                <a-progress :stroke-color="{'0%': '#108ee9','100%': '#87d068'}" :percent="formatPercent(record)"/>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="finished" tab="已完成">
          <a-table :data-source="taskListEnded" :columns="taskEndedColumns" :pagination="{defaultPageSize: 3}">
            <span slot="status" slot-scope="text, record">
               <a-badge color="green" text="已完成"/>
            </span>
            <span slot="startTime" slot-scope="text, record">
              {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span slot="endTime" slot-scope="text, record">
              {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="previewDownload(record)"><a-icon type="eye"/> 预览</a>
              <a-divider type="vertical"/>
              <a target="_blank" :href="record.downloadFile"><a-icon type="cloud-download"/> 下载</a>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </div>
</template>

<script>
import {STable} from '@/components'
import {addFileDownTask, getDownloadTaskList, queryRecordDetails, recordDateList} from "@/api/recordList";
import moment from "moment";
import LivePlayer from "@liveqing/liveplayer";

const columns = [{
  title: '录制开始',
  dataIndex: 'startTime',
  align: 'center'
}, {
  title: '录制结束',
  dataIndex: 'endTime',
  align: 'center'
}, {
  title: '时长',
  dataIndex: 'duration',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  scopedSlots: {customRender: 'action'}
}]

const taskRunningColumns = [{
  title: '开始时间',
  dataIndex: 'startTime',
  align: 'center',
  scopedSlots: {customRender: 'startTime'}
}, {
  title: '结束时间',
  dataIndex: 'endTime',
  align: 'center',
  scopedSlots: {customRender: 'endTime'}
}, {
  title: '状态',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: {customRender: 'status'}
}, {
  title: '进度',
  dataIndex: 'percentage',
  align: 'center',
  scopedSlots: {customRender: 'process'}
}]

const taskEndedColumns = [{
  title: '开始时间',
  dataIndex: 'startTime',
  align: 'center',
  scopedSlots: {customRender: 'startTime'}
}, {
  title: '结束时间',
  dataIndex: 'endTime',
  align: 'center',
  scopedSlots: {customRender: 'endTime'}
}, {
  title: '状态',
  dataIndex: 'status',
  align: 'center',
  scopedSlots: {customRender: 'status'}
}, {
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  scopedSlots: {customRender: 'action'}
}]

export default {
  name: "NVRRecordDetail",
  components: {
    STable,
    LivePlayer
  },
  props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
  data() {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        requestParameters.mediaServerId = this.record.mediaServerId
        requestParameters.app = this.record.app
        requestParameters.stream = this.record.stream
        return recordDateList(requestParameters).then(res => {
          this.dateFilesObj = res.data
          if (!this.chooseDate && this.dateFilesObj.length > 0) {
            this.chooseDate = this.dateFilesObj[this.dateFilesObj.length - 1];
          }
          requestParameters.startTime = this.chooseDate + " 00:00:00"
          requestParameters.endTime = this.chooseDate + " 23:59:59"
          return requestParameters
        }).then((params) => {
          return queryRecordDetails(params)
        }).then(res => {
          return res.data
        })
      },
      dateFilesObj: [],
      chooseDate: null,
      videoUrl: '',
      basePath: this.record.mediaServerPath,
      playerStyle: {
        "margin": "auto",
        "margin-bottom": "20px",
        "height": window.innerHeight - 350 + "px",
      },
      downloadUrl: '',
      drawerVisible: false,
      taskTimeRange: [],
      taskListEnded: [],
      taskListForRunning: [],
      taskRunningColumns,
      taskEndedColumns,
      taskUpdate: null,
      tabVal: ''
    }
  },
  created() {
    console.log(this.record)
  },
  methods: {
    moment,
    handleGoBack() {
      this.$emit('goBack')
    },
    getCurrentStyle(current, today) {
      const style = {};
      // 通过显示一个圈识这一天有录像
      let date = moment(current).format('YYYY-MM-DD')
      if (this.dateFilesObj.includes(date)) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      }
      return style;
    },
    dateChange(date, dateStr) {
      this.chooseDate = dateStr
    },
    playVideo(record) {
      this.videoUrl = `${this.basePath}/record/${this.record.app}/${this.record.stream}/${this.chooseDate}/${record.originalName}`
    },
    downloadVideo(record) {
      let fileUrl = `${this.basePath}/record/${this.record.app}/${this.record.stream}/${this.chooseDate}/${record.originalName}`
      this.downloadUrl = `${this.basePath}/download.html?url=${fileUrl}`
    },
    videoCut() {
      this.drawerVisible = true
      if (this.taskUpdate != null) window.clearInterval(this.taskUpdate)
      this.taskUpdate = setInterval(() => {
        this.getTaskList(this.tabVal === "finished")
      }, 1000)
    },
    drawerClose() {
      this.drawerVisible = false
      if (this.taskUpdate != null) window.clearInterval(this.taskUpdate)
    },
    tabCallback(key) {
      this.tabVal = key
      this.getTaskList('finished' === this.tabVal)
    },
    rangePickerChange(value, dateString) {
      this.taskTimeRange = dateString
    },
    getTaskList(isEnd) {
      getDownloadTaskList({mediaServerId: this.record.mediaServerId, isEnd: isEnd}).then(res => {
        if (res.code === 0) {
          if (isEnd) {
            this.taskListEnded = res.data.filter(item => {
              return this.record.stream === item.stream
            })
            //console.log(this.taskListEnded)
          } else {
            this.taskListForRunning = res.data
            //console.log(this.taskListForRunning);
          }
        }
      }).catch(err => console.log(err))
    },
    addTaskToServer() {
      let params = {
        mediaServerId: this.record.mediaServerId,
        app: this.record.app,
        stream: this.record.stream,
        startTime: this.taskTimeRange[0],
        endTime: this.taskTimeRange[1]
      }
      addFileDownTask(params).then(res => {
        console.log(res)
        if (res.code === 0 && res.msg === "success") {
          this.getTaskList(false)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => console.log(err))

    },
    previewDownload(row) {
      this.drawerClose()
      this.videoUrl = row.playFile
    },

    formatPercent(row) {
      //console.log(row.percentage)
      if (row.percentage > 0)
        return (Math.round(row.percentage * 100) / 100)
      return 0
    }
  }
}
</script>

<style scoped>

</style>
