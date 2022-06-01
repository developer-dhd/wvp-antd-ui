<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" :gutter="[5, 0]">
          <a-col :flex="1">
            <a-form-item label="关键字搜索">
              <a-input v-model="queryParam.query" placeholder="关键字" style="width: 100%" clearable/>
            </a-form-item>
          </a-col>
          <a-col :flex="1">
            <a-form-item label="推流状态">
              <a-select v-model="queryParam.pushing" placeholder="请选择" style="width: 100%">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="true">推流进行中</a-select-option>
                <a-select-option value="false">推流未进行</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col>
            <a-space>
              <a-button type="primary" @click="$refs.gbStreamsTable.refresh(true)" icon="search">查询</a-button>
              <a-button type="danger" @click="() => this.queryParam = {}" icon="redo">重置</a-button>
            </a-space>
          </a-col>
          <a-col>
            <a-button v-if="catalogId !== null" icon="delete"
                      :disabled="gbStreams.length === 0 || selectedRows.length === 0" type="danger"
                      @click="batchDel">批量移除
            </a-button>
            <a-button v-if="catalogId === null" icon="plus"
                      :disabled="gbStreams.length === 0 || selectedRows.length === 0"
                      @click="batchAdd">批量添加
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="gbStreamsTable"
      size="default"
      :rowKey="(record) => record.deviceId + '_' + record.channelId"
      :columns="columns"
      :data="loadData"
      :rowSelection="rowSelection"
      showPagination="auto">
      <span slot="operator">
        <span v-if="catalogId == null">{{ catalogName }}的直播通道</span>
        <span v-if="catalogId != null">{{ catalogName }}（{{ catalogId }}）的直播通道</span>
      </span>
      <span slot="streamType" slot-scope="text, record">
        <a-tag color="blue">
          {{ formatStreamType(text) }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm title="确认添加？" ok-text="确认" cancel-text="取消" @confirm="add(record)">
          <a-button size="small" icon="plus" v-if="catalogId === null" type="primary">添加</a-button>
        </a-popconfirm>
        <a-popconfirm title="确认移除？" ok-text="确认" cancel-text="取消" @confirm="remove(record)">
          <a-button size="small" icon="delete" v-if="catalogId !== null" type="danger">移除</a-button>
        </a-popconfirm>
      </span>
    </s-table>
    <get-catalog-modal ref="getCatalog" :platformId="platformId"/>
  </div>
</template>

<script>
import {STable} from '@/components'
import {gbStreamAdd, gbStreamDel, queryGbChannel} from "@/api/gbPlatform";
import GetCatalogModal from "./GetCatalogModal";
import {getOnlineMediaServerList} from "@/api/mediaServer";

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center'
  }, {
    title: '应用名',
    dataIndex: 'app',
    align: 'center'
  }, {
    title: '流ID',
    dataIndex: 'stream',
    align: 'center'
  }, {
    title: '国标编码',
    dataIndex: 'gbId',
    align: 'center'
  }, {
    title: '流来源',
    dataIndex: 'streamType',
    align: 'center',
    scopedSlots: {customRender: 'streamType'}
  }, {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: {customRender: 'action'}
  }]

export default {
  name: 'ChannelForStream',
  props: ['platformId', 'catalogId', 'catalogName'],
  components: {
    GetCatalogModal,
    STable
  },
  data() {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {
        query: '',
        pushing: ''
      },
      selectedRowKeys: [],
      selectedRows: [],
      selections: [],
      gbChooseChannel: {},
      mediaServerId: "",
      mediaServerList: [],
      gbStreams: [],
      loadData: parameter => { // 加载数据方法必须为Promise对象
        let targetParams = {
          platformId: this.platformId,
          catalogId: this.catalogId,
          mediaServerId: this.mediaServerId
        }
        const requestParameters = Object.assign(targetParams, parameter, this.queryParam)
        return queryGbChannel(requestParameters).then(res => {
          this.gbStreams = res.list;
          this.gbChooseChannel = {}
          return res
        }).catch(err => console.log(err))
      },
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        selections: this.selections
      }
    },

    formatStreamType(streamType) {
      return (streamType) => {
        if (streamType === 'proxy') return '拉流代理'
        if (streamType === 'push') return '推流'
      }
    }
  },

  mounted() {
    getOnlineMediaServerList().then(res => {
      //console.log('ZLM 列表：\n' + JSON.stringify(res))
      this.mediaServerList = res.data
    }).catch(err => console.log(err))
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    add(row) {
      this.getCatalogFromUser(catalogId => {
        gbStreamAdd({
          platformId: this.platformId,
          catalogId: catalogId,
          gbStreams: [row],
        }).then(res => {
          this.$message.success('保存成功')
          this.$refs.gbStreamsTable.refresh()
        }).catch(err => console.log(err))
      })
    },

    remove(row) {
      gbStreamDel({platformId: this.platformId, gbStreams: [row]}).then(res => {
        this.$message.success('移除成功')
        this.$refs.gbStreamsTable.refresh()
      }).catch(err => console.log(err))
    },

    batchDel() {
      let _this = this
      this.$confirm({
        title: '删除提示',
        content: `确认这${this.selectedRows.length}个通道吗？`,
        okText: '确定',
        cancelText: '取消',
        okType: 'warning',
        onOk() {
          gbStreamDel({platformId: _this.platformId, gbStreams: _this.selectedRows}).then(res => {
            _this.$message.success('删除成功')
            _this.$refs.gbStreamsTable.refresh()
          }).catch(error => console.log(error))
        },
        onCancel() {
        }
      })
    },

    batchAdd: function () {
      this.getCatalogFromUser(catalogId => {
        gbStreamAdd({
          platformId: this.platformId,
          catalogId: catalogId,
          gbStreams: this.selectedRows
        }).then(res => {
          this.$message.success('保存成功')
          this.$refs.gbStreamsTable.refresh()
        }).catch(error => console.log(error))
      })
    },

    getCatalogFromUser(callback) {
      this.$refs.getCatalog.openDialog(callback)
    }
  }
}
</script>
