<template>
  <div>
    <a-card :bordered="false">
      <div slot="title" style="display: flex; width: 100%; flex-direction: row; justify-content: space-between">
        <div>选择通道</div>
        <a-button icon=rollback @click="goBack">返回</a-button>
      </div>
      <a-row type="flex" :gutter="16">
        <a-col flex="1">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1">
                <span slot="tab">
                  <a-icon type="unordered-list"/>
                  目录结构
                </span>
              <channel-for-catalog :platformId=platformId :platformName=platformName :defaultCatalogId=defaultCatalogId
                                   :catalogIdChange="catalogIdChange"/>
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col>
          <a-divider type="vertical" style="height: 100%"/>
        </a-col>
        <a-col flex="3">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1">
               <span slot="tab">
                 GB 国标通道
               </span>
              <channel-for-gb :catalogId="catalogId" :catalogName="catalogName" :platformId="platformId"/>
            </a-tab-pane>

            <a-tab-pane key="2">
                <span slot="tab">
                  <a-icon type="video-camera"/>
                  直播流通道
                </span>
              <channel-for-stream :catalogId="catalogId" :catalogName="catalogName" :platformId=platformId
                                  :currentCatalogId="currentCatalogId"/>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import ChannelForCatalog from "./ChannelForCatalog";
import ChannelForGb from "./ChannelForGb";
import ChannelForStream from "./ChannelForStream";

export default {
  name: "ChannelSharePage",
  props: ['model'],
  components: {
    ChannelForCatalog,
    ChannelForGb,
    ChannelForStream
  },
  data() {
    return {
      catalogId: '',
      catalogName: '',
      currentCatalogId: "",
      platformId: this.model.platformId,
      platformName: this.model.platformName,
      defaultCatalogId: this.model.defaultCatalogId,
    }
  },
  methods: {
    catalogIdChange(id, name) {
      this.catalogId = id;
      this.catalogName = name;
    },
    goBack() {
      this.$emit('goBack')
    }
  }
}
</script>

<style scoped>

</style>
