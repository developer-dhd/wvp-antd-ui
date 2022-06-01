<template>
  <div>
    <a-card :bordered="false" :bodyStyle="tableStyle">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row type="flex" :gutter="[16,0]">
            <a-col :flex="1">
              <a-form-item label="搜索">
                <a-input v-model="queryParam.query" placeholder="关键字" style="width: 100%" @input="refreshTable"/>
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item label="流媒体">
                <a-select v-model="queryParam.mediaServerId" placeholder="请选择" default-value="0" style="width: 100%"
                          @change="refreshTable">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in mediaServerList" :key="item.id" :value="item.id">{{ item.id }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item label="推流状态">
                <a-select v-model="queryParam.pushing" placeholder="请选择" default-value="0" style="width: 100%"
                          @change="refreshTable">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="true">推流进行中</a-select-option>
                  <a-select-option value="false">推流未进行</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col>
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="importChannel">通道导入</a-button>
                <a-button type="primary" @click="" style="margin-left: 10px">
                  <a href="/file/推流通道导入.zip" download='推流通道导入.zip'>下载模板</a>
                </a-button>
                <a-button type="danger" :disabled="selectedRows.length === 0" @click="batchDel"
                          style="margin-left: 10px">批量移除</a-button>
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
        :rowKey="(record) => record.deviceId "
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
      >
        <span slot="createStamp" slot-scope="text, record">
          {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
        </span>

        <span slot="status" slot-scope="text, record">
          {{ (record.status === false && record.gbId == null) || record.status ? '是' : '否' }}
        </span>

        <span slot="action" slot-scope="text, record">
          <a-button-group>
            <a-button size="mini" v-if="(record.status === false && record.gbId == null) || record.status"
                      @click="playPush(record)">播放</a-button>
            <a-button size="mini" type="danger" @click="stopPush(record)">移除</a-button>
            <a-button size="mini" type="primary" v-if="!!!record.gbId" @click="addToGB(record)">加入国标</a-button>
            <a-button size="mini" type="primary" v-if="!!record.gbId" @click="removeFromGB(record)">移出国标</a-button>
          </a-button-group>
        </span>
      </s-table>
    </a-card>
    <modal-player ref="modalPlayer"/>
    <AddStreamTOGB ref="addStreamTOGB"/>
    <import-channel ref="importChannel"/>
  </div>

</template>

<script>
import {STable} from '@/components'
import {getOnlineMediaServerList} from "@/api/mediaServer";
import {getStreamPushList, removeFromGBRequest, stopPushRequest, streamBatchStop} from "@/api/streamPush";
import moment from "moment";
import ModalPlayer from "./ModalPlayer";
import {getStreamInfoByAppAndStream} from "@/api/streamPush";
import AddStreamTOGB from "./AddStreamTOGB";
import ImportChannel from "./ImportChannel";

const queryParam = {
  query: '',
  mediaServerId: '',
  pushing: ''
}

const columns = [
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '应用名',
    align: 'center',
    dataIndex: 'app'
  }, {
    title: '流ID',
    align: 'center',
    dataIndex: 'stream'
  }, {
    title: '国标编码',
    align: 'center',
    dataIndex: 'gbId'
  }, {
    title: '流媒体',
    align: 'center',
    dataIndex: 'mediaServerId'
  }, {
    title: '开始时间',
    align: 'center',
    dataIndex: 'createStamp',
    scopedSlots: {customRender: 'createStamp'}
  }, {
    title: '正在推流',
    align: 'center',
    dataIndex: 'status',
    scopedSlots: {customRender: 'status'}
  }, {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: {customRender: 'action'}
  }
]

export default {
  name: "StreamPushList",
  components: {STable, ModalPlayer, AddStreamTOGB, ImportChannel},
  data() {
    return {
      // 查询参数
      queryParam,
      columns,
      mediaServerList: [],
      selectedRowKeys: [],
      selectedRows: [],
      tableStyle: {'padding-bottom': '0px', 'margin-bottom': '10px'},
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getOnlineMediaServerList().then(res => {
          this.mediaServerList = res.data
          return requestParameters
        }).then((requestParameters) => {
          getStreamPushList(requestParameters).then(data => {
            console.log(data)
            return data
          })
        })
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    moment,
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    playPush(row) {
      let params = {
        app: row.app,
        stream: row.stream,
        mediaServerId: row.mediaServerId
      }
      getStreamInfoByAppAndStream(params).then(res => {
        this.$refs.modalPlayer.open(res.data)
      }).catch(err => console.log(err))
    },
    stopPush(row) {
      stopPushRequest({app: row.app, streamId: row.stream}).then(res => {
        if (res === 'success') this.refreshTable()
      }).catch(err => console.log(err))
    },
    addToGB(row) {
      this.$refs.addStreamTOGB.open({
        app: row.app,
        stream: row.stream,
        mediaServerId: row.mediaServerId
      }, this.refreshTable())
    },
    removeFromGB(row) {
      removeFromGBRequest(row).then(res => {
        if (res === "success") this.refreshTable()
      }).catch(err => console.log(err))
    },
    importChannel() {
      this.$refs.importChannel.open(null)
    },
    batchDel() {
      let _this = this
      this.$confirm({
        title: '提示',
        content: `确定删除选中的${this.selectedRows.length}个通道?`,
        okText: '确定',
        cancelText: '取消',
        okType: 'warning',
        onOk() {
          streamBatchStop({gbStreams: this.selectedRows}).then(res => {
            _this.refreshTable()
          }).catch(err => console.log(err))
        },
        onCancel() {
        }
      })
    },
    refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
