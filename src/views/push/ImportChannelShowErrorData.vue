<template>
  <a-modal
    title="导入通道数据成功，但数据存在重复"
    width="30rem"
    :visible="showDialog"
    @cancel="close">
    <a-card :bordered="false">
      <div slot="title" class="titleSlot">
        <span>重复国标ID</span>
        <a-button
          type="primary"
          v-clipboard:copy="gbIds.join(',')"
          v-clipboard:success="()=>$message.success('成功拷贝到粘贴板')"
          v-clipboard:error="()=>{$message.error('复制失败')}">
          复制
        </a-button>
      </div>
      <a-list :data-source="gbIds" :pagination="{pageSize: 5}">
        <a-list-item slot="renderItem" slot-scope="item, index">
          {{item}}
        </a-list-item>
      </a-list>
    </a-card>

    <a-card :bordered="false">
      <div slot="title" class="titleSlot">
        <span>重复App/Stream</span>
        <a-button
          type="primary"
          v-clipboard:copy="streams.join(',')"
          v-clipboard:success="()=>$message.success('成功拷贝到粘贴板')"
          v-clipboard:error="()=>{$message.error('复制失败')}">
          复制
        </a-button>
      </div>
      <a-list :data-source="streams" :pagination="{pageSize: 5}">
        <a-list-item slot="renderItem" slot-scope="item, index">
          {{item}}
        </a-list-item>
      </a-list>
    </a-card>
  </a-modal>
</template>

<script>

export default {
  name: "ImportChannelShowErrorData",
  props: ['gbIds', 'streams'],
  data() {
    return {
      showDialog: false,
    }
  },
  methods: {
    openDialog() {
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
    },
  },
};
</script>
<style lang="less" scoped>

.titleSlot {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between
}
</style>
