<template>
  <div>
    <a-card :bordered="false" :bodyStyle="tableStyle">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row type="flex" :gutter="[16, 0]">
            <a-col :flex="1">
              <a-form-item label="搜索设备">
                <a-input v-model="queryParam.query" placeholder="关键字: 通道名称/通道ID" style="width: 20rem"/>
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item label="通道类型">
                <a-select v-model="queryParam.channelType" placeholder="请选择" default-value="" style="width: 20rem">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="false">设备</a-select-option>
                  <a-select-option value="true">子目录</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item label="在线状态">
                <a-select v-model="queryParam.online" placeholder="请选择" default-value="" style="width: 20rem">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="true">在线</a-select-option>
                  <a-select-option value="false">离线</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col>
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin: 0 8px " @click="() => this.queryParam = {}">重置</a-button>
                <a-button @click="handleGoBack">返回</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card :bordered="false">
      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.channelId"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <template slot="operator">
          <a-icon type="info-circle"/>
          设备 <code>{{ record.parentChannelId === 0 ? record.deviceId : record.parentChannelId }}</code> 的通道列表
          <a-divider type="vertical"/>
          <a-checkbox v-model="autoList" @change="autoListChange">自动刷新</a-checkbox>
        </template>

        <span slot="hasAudio" slot-scope="text, record">
          <a-switch
            checked-children="开"
            un-checked-children="关"
            :checked="text"
            v-model="record.hasAudio"
            @change="updateChannel(record)"/>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="snap" slot-scope="record">
          <a-tooltip title="点击查看大图">
            <img
              style="max-height: 1rem;max-width: 4rem;"
              :src="getSnap(record)"
              @click="previewImage(record)"
              alt="快照"/>
          </a-tooltip>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button-group>
            <a-button size="small" @click="sendDevicePush(record)">
              <font-awesome-icon :icon="['fas','play']" style="margin-right: 0.25rem;font-size: 12px"/>
              播放
            </a-button>
            <a-button
              size="small"
              type="danger"
              v-if="!!record.streamId"
              @click="stopDevicePush(record)"
              :loading="closePushBtnLoading">
              <font-awesome-icon :icon="['fas','stop']" style="margin-right: 0.25rem;font-size: 12px"/>
              关闭流
            </a-button>
            <a-button size="small" type="primary" v-if="record.subCount > 0 || record.parental === 1" @click="changeSubChannel(record)">
              <font-awesome-icon :icon="['fas','info-circle']" style="margin-right: 0.25rem;font-size: 12px"/>
              查看
            </a-button>
            <a-button size="small" type="primary" @click="queryRecords(record)">
              <font-awesome-icon :icon="['fas', 'video']" style="margin-right: 0.25rem;font-size: 12px"/>
              设备录象
            </a-button>
          </a-button-group>
        </span>
      </s-table>
    </a-card>
    <device-channel-player ref="deviceChannelPlayer" @updateTable="refreshTable" />
  </div>
</template>

<script>
import moment from 'moment'
import { Ellipsis, STable } from '@/components'
import {
  getDeviceChannelList, showSubChannels,
  stopDevicePush,
  updateChannel
} from '@/api/deviceList'

import DeviceChannelPlayer from './DeviceChannelPlayer'

const columns = [
  {
    title: '通道名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '快照',
    align: 'center',
    scopedSlots: { customRender: 'snap' }
  },
  {
    title: '通道编号',
    dataIndex: 'channelId',
    align: 'center'
  },
  {
    title: '子节点数',
    dataIndex: 'subCount',
    align: 'center'
  },
  {
    title: '开启音频',
    dataIndex: 'hasAudio',
    align: 'center',
    scopedSlots: { customRender: 'hasAudio' }
  },
  {
    title: '云台类型',
    dataIndex: 'ptztypeText',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'success',
    text: '开启'
  }
}

export default {
  name: 'DeviceChannelList',
  props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
  components: {
    STable,
    Ellipsis,
    DeviceChannelPlayer
  },
  data() {
    this.columns = columns
    return {
      // create model
      visible: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      // 加载数据方法必须为Promise对象
      loadData: parameter => {
        let deviceId = this.record.deviceId
        let parentChannelId = this.record.parentChannelId
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        requestParameters.deviceId = deviceId
        if (typeof (parentChannelId) == "undefined" || parentChannelId === 0) {
          return getDeviceChannelList(requestParameters).then(data => {
            return data
          })
        } else {
          requestParameters.parentChannelId = parentChannelId
          return showSubChannels(requestParameters).then(data => {
            return data
          })
        }

      },
      tableStyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
      closePushBtnLoading: false,
      loadSnap: {},
      autoList: false,
      updateLooper: 0, //数据刷新轮询标志
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  mounted() {
    //setInterval(this.$refs.table.refresh, 60 * 1000)
  },

  beforeDestroy() {
    clearTimeout(this.updateLooper)
  },

  methods: {
    handleGoBack() {
      this.$emit('goBack')
    },
    sendDevicePush(channelInfo) { // 通知设备上传媒体流
      const deviceId = channelInfo.deviceId
      const channelId = channelInfo.channelId
      console.log('通知设备推流：' + deviceId + ' : ' + channelId)
      this.$refs.deviceChannelPlayer.openDialog(channelInfo)
    },
    stopDevicePush(channelInfo) {
      this.closePushBtnLoading = true
      const params = {
        deviceId: channelInfo.deviceId,
        channelId: channelInfo.channelId
      }
      stopDevicePush(params).then(res => {
        console.log('停止推流：' + res)
        this.refreshTable()
        this.closePushBtnLoading = false
      }).catch(err => {
        console.log(err)
        this.closePushBtnLoading = false
        this.refreshTable()
      })
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    refreshTable() {
      this.$refs.table.refresh()
    },
    changeSubChannel(channelInfo) {
      // this.$message.warn('敬请期待')
      this.record.parentChannelId = channelInfo.channelId
      this.$refs.table.refresh(true)
    },
    updateChannel(channelInfo) {
      updateChannel(channelInfo).then(res => {
          this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
        this.$message.error('操作失败')
      })
    },

    getSnap: function (row) {
      return '/static/snap/' + row.deviceId + '_' + row.channelId + '.jpg?' + new Date().getTime()
    },

    previewImage(row) {
      window.open(this.getSnap(row))
    },
    queryRecords(row) {
      this.$emit('goGBRecords', row)
    },

    autoListChange() {
      if (this.autoList) {
        this.updateLooper = setInterval(this.refreshTable, 1500);
      } else {
        window.clearInterval(this.updateLooper);
      }
    }
  }

}
</script>
