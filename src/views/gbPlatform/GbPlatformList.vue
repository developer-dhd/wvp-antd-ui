<template>
  <div>
    <a-card :bordered="false" title="上级平台列表">
      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData">
        <a-button slot="operator" type="primary" @click="addParentPlatform">
          <font-awesome-icon :icon="['fas', 'plus']" style="margin-right: 0.25rem"/>
          添加
        </a-button>

        <span slot="enable" slot-scope="text, record">
          <a-tag :color="text ? 'green' : 'gold'">
             {{ text ? '已启用' : '未启用' }}
          </a-tag>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-tag :color="text ? 'green': 'gold'">
            {{ text ? '在线' : '离线' }}
          </a-tag>
        </span>
        <span slot="serverIP" slot-scope="text, record">
          <a-tag color="blue">
            {{ text }}:{{ record.serverPort }}
          </a-tag>
        </span>
        <span slot="subscribe" slot-scope="text, row">
          <i v-if="row.alarmSubscribe" style="font-size: 20px" title="报警订阅"
             class="iconfont icon-gbaojings subscribe-on "></i>
          <i v-if="!row.alarmSubscribe" style="font-size: 20px" title="报警订阅"
             class="iconfont icon-gbaojings subscribe-off " />
          <i v-if="row.catalogSubscribe" title="目录订阅" class="iconfont icon-gjichus subscribe-on"></i>
          <i v-if="!row.catalogSubscribe" title="目录订阅" class="iconfont icon-gjichus subscribe-off"></i>
          <i v-if="row.gpsSubscribe" title="位置订阅" class="iconfont icon-gxunjians subscribe-on"></i>
          <i v-if="!row.gpsSubscribe" title="位置订阅" class="iconfont icon-gxunjians subscribe-off"></i>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="editPlatform(record)"><a-icon type="edit"/> 编辑</a>
          <a-divider type="vertical"/>
          <a @click="goChannelSharePage(record)"><a-icon type="share-alt"/> 选择通道</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除上级平台信息？" ok-text="确认" cancel-text="取消" @confirm="deletePlatform(record)">
            <a><a-icon type="delete"/> 删除</a>
          </a-popconfirm>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import {STable} from '@/components'
import {deletePlatformCommit, getPlatformList} from "@/api/gbPlatform";

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '平台编号',
    dataIndex: 'serverGBId',
    align: 'center'
  },
  {
    title: '是否启用',
    dataIndex: 'enable',
    align: 'center',
    scopedSlots: {customRender: 'enable'}
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: {customRender: 'status'}
  },
  {
    title: '地址',
    dataIndex: 'serverIP',
    align: 'center',
    scopedSlots: {customRender: 'serverIP'}
  },
  {
    title: '设备国标编号',
    dataIndex: 'deviceGBId',
    align: 'center'
  },
  {
    title: '信令传输模式',
    dataIndex: 'transport',
    align: 'center'
  },
  {
    title: '通道数',
    dataIndex: 'channelCount',
    align: 'center'
  },
  {
    title: '订阅信息',
    dataIndex: 'subscribe',
    align: 'center',
    width: 240,
    scopedSlots: {customRender: 'subscribe'}
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: {customRender: 'action'}
  }]
export default {
  components: {
    STable
  },
  data() {
    return {
      columns,
      // 查询参数
      queryParam: {},
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getPlatformList(requestParameters).then(res => {
          return res
        })
      },
      formVisible: false
    }
  },
  methods: {
    refreshTable() {
      this.$refs.table.refresh()
    },
    addParentPlatform() {
      this.$emit('goGbPlatformEdit')
    },
    editPlatform(row) {
      this.$emit('goGbPlatformEdit', row)
    },
    goChannelSharePage(params) {
      let targetParams = {
        platformId: params.serverGBId,
        platformName: params.name,
        defaultCatalogId: params.catalogId
      }
      console.log(targetParams)
      this.$emit('goChannelShare', targetParams)
    },
    deletePlatform(row) {
      deletePlatformCommit({serverGBId: row.serverGBId}).then(res => {
        if (res === "success") {
          this.$message.success('删除成功');
          this.refreshTable()
        } else {
          this.$message.error('删除失败');
        }
      }).catch(err => {
        this.$message.error('删除失败：' + err);
      })
    }
  }
}
</script>

<style scoped>

.subscribe-on{
  color: #409EFF;
  font-size: 18px;
}
.subscribe-off{
  color: #afafb3;
  font-size: 18px;
}

</style>
