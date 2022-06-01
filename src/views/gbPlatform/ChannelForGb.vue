<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" :gutter="[5, 0]">
          <a-col :flex="2">
            <a-form-item label="搜索">
              <a-input v-model="queryParam.query" placeholder="关键字" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :flex="1">
            <a-form-item label="通道类型">
              <a-select v-model="queryParam.channelType" placeholder="选择通道类型">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="false">设备</a-select-option>
                <a-select-option value="true">子目录</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :flex="1">
            <a-form-item label="在线状态">
              <a-select v-model="queryParam.online" placeholder="请选择在线状态">
                <a-select-option value="true">在线</a-select-option>
                <a-select-option value="false">离线</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col>
            <a-space>
              <a-button type="primary" @click="$refs.gbChannelsTable.refresh(true)">
                <font-awesome-icon :icon="['fas','search']" style="margin-right: 0.25rem"/>
                查询
              </a-button>
              <a-button type="danger" @click="() => this.queryParam = {}">
                <font-awesome-icon :icon="['fas','redo']" style="margin-right: 0.25rem"/>
                重置
              </a-button>
              <a-button v-if="catalogId !== null" icon="delete"
                        :disabled="gbChannels.length === 0 || selectedRows.length === 0" type="danger"
                        @click="batchDel">批量移除
              </a-button>
              <a-button v-if="catalogId === null" icon="plus"
                        :disabled="gbChannels.length === 0 || selectedRows.length === 0" @click="batchAdd">批量添加
              </a-button>
              <!--<a-button icon="plus" @click="batchAdd">批量添加</a-button>-->
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="gbChannelsTable"
      size="default"
      :rowKey="(record) => record.deviceId + '_' + record.channelId"
      :columns="columns"
      :data="loadData"
      :rowSelection="rowSelection"
      showPagination="auto">
      <span slot="operator">
        <span v-if="catalogId == null">{{ catalogName }}的国标通道</span>
        <span v-if="catalogId != null">{{ catalogName }}（{{ catalogId }}）的国标通道</span>
      </span>
      <span slot="action" slot-scope="text, row">
        <a-popconfirm title="确认添加？" ok-text="确认" cancel-text="取消" @confirm="add(row)">
          <a-button size="small" icon="plus" v-if="catalogId === null" type="primary">添加</a-button>
        </a-popconfirm>
        <a-popconfirm title="确认移除？" ok-text="确认" cancel-text="取消" @confirm="remove(row)">
          <a-button size="small" icon="delete" v-if="catalogId !== null" type="danger">移除</a-button>
        </a-popconfirm>
      </span>
    </s-table>
    <get-catalog-modal ref="getCatalog" :platformId="platformId"/>
  </div>
</template>

<script>
import {STable} from '@/components'
import GetCatalogModal from "./GetCatalogModal";
import {deleteChannelForGB, getChannelList, updateChannelForGB} from "@/api/gbPlatform";

const columns = [
  {
    title: '通道名称',
    dataIndex: 'name',
    align: 'center'
  }, {
    title: '通道编号',
    dataIndex: 'channelId',
    align: 'center'
  }, {
    title: '设备编号',
    dataIndex: 'deviceId',
    align: 'center'
  }, {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: {customRender: 'action'}
  }]

export default {
  name: 'DeviceChannelList',
  props: ['platformId', 'catalogId', 'catalogName'],
  components: {
    STable,
    GetCatalogModal
  },
  data() {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {
        query: '',
        channelType: '',
        online: ''
      },
      // 加载数据方法必须为Promise对象
      loadData: parameter => {
        let paramsTarget = {
          platformId: this.platformId,
          catalogId: this.catalogId,
        }
        console.log(paramsTarget)
        const requestParameters = Object.assign(paramsTarget, parameter, this.queryParam)
        return getChannelList(requestParameters).then(res => {
          console.log(res)
          this.gbChannels = res.list
          this.gbChooseChannel = {}
          return res
        }).catch(err => console.log(err))
      },
      selectedRowKeys: [],
      selectedRows: [],
      selections: [],
      gbChannels: [],
      gbChooseChannel: {},
      tableStyle: {'padding-bottom': '0px', 'margin-bottom': '10px'}
    }
  },
  watch: {
    platformId(newData, oldData) {
      console.log(newData)
      setTimeout(()=>{
        this.$refs.gbChannelsTable.refresh(true)
      },200)

    },
    catalogId(newData, oldData) {
      console.log('catalogId：' + newData)
      setTimeout(()=>{
        this.$refs.gbChannelsTable.refresh(true)
      }, 100)
    },
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        selections: this.selections
      }
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
          deleteChannelForGB({platformId: _this.platformId, channelReduces: _this.selectedRows}).then(res => {
            _this.$message.success('删除成功')
            _this.$refs.gbChannelsTable.refresh()
          }).catch(error => console.log(error))
        },
        onCancel() {
        }
      })
    },

    batchAdd() {
      this.getCatalogFromUser((catalogId) => {
        updateChannelForGB({
          platformId: this.platformId,
          channelReduces: this.selectedRows,
          catalogId: catalogId
        }).then(res => {
          this.$message.success('保存成功')
          this.$refs.gbChannelsTable.refresh()
        }).catch(err => console.log(err))
      })
    },

    getCatalogFromUser(callback) {
      this.$refs.getCatalog.openDialog(callback)
    },

    add(row) {
      this.getCatalogFromUser(catalogId => {
        updateChannelForGB({
          platformId: this.platformId,
          channelReduces: [row],
          catalogId: catalogId
        }).then(res => {
          this.$message.success('保存成功')
          this.$refs.gbChannelsTable.refresh()
        }).catch(err => console.log(err))
      })
    },

    remove(row) {
      deleteChannelForGB({platformId: this.platformId, channelReduces: [row]}).then(res => {
        this.$message.success('移除成功')
        this.$refs.gbChannelsTable.refresh()
      }).catch(err => console.log(err))
    }
  }
}
</script>
