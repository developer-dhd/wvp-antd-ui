<template>
  <div>
    <a-modal
      title="选择要添加到的节点"
      v-if="showDialog"
      :visible.sync="showDialog"
      @ok="submit"
      @cancel="close()">
      <el-tree
        class="el-scrollbar"
        ref="tree"
        id="catalogTree"
        empty-text="未知节点"
        node-key="id"
        default-expand-all
        :highlight-current="false"
        :expand-on-click-node="false"
        :props="props"
        :load="loadNode"
        @node-click="nodeClickHandler"
        lazy>
       <span slot-scope="{ node, data }" style="width: 100%">
         <el-radio v-if="node.data.type === 0 || node.data.type === -1" style="margin-right: 0" v-model="chooseId"
                   :label="node.data.id">{{ '' }}</el-radio>
         <span v-if="node.data.type === -1 && node.level === 1" style="font-size: 12px"
               class="iconfont icon-ziyuan"></span>
         <span v-if="node.data.type === 0 && node.level === 1" class="el-icon-s-home"></span>
         <span v-if="node.data.type === 0 && node.level > 1" class="el-icon-folder-opened"></span>
         <span v-if="node.data.type === 1" class="iconfont icon-shexiangtou"></span>
         <span v-if="node.data.type === 2" class="iconfont icon-zhibo"></span>
        <span style=" padding-left: 1px">{{ node.label }}</span>
        <span>
          <i style="margin-left: 5rem; color: #9d9d9d; padding-right: 20px"
             v-if="node.data.id === defaultCatalogIdSign">默认</i>
        </span>
      </span>
      </el-tree>
    </a-modal>

  </div>
</template>


<script>

import {getCatalog, getPlatformById} from "@/api/gbPlatform";

export default {
  name: 'GetCatalogModal',
  props: ['platformId'],
  data() {
    return {
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      platformName: null,
      defaultCatalogId: null,
      catalogIdResult: null,
      showDialog: false,
      defaultCatalogIdSign: null,
      chooseNode: null,
      chooseId: "",
      catalogTree: null,
      contextmenuShow: false,
    };
  },
  mounted() {
    this.chooseId = this.defaultCatalogId;
    this.defaultCatalogIdSign = this.defaultCatalogId;
    this.initData();
    if (this.catalogIdChange) this.catalogIdChange(this.defaultCatalogId);
  },
  methods: {
    openDialog(catalogIdResult) {
      this.showDialog = true
      this.catalogIdResult = catalogIdResult
    },
    initData() {
      this.getCatalog();
    },

    getCatalog(parentId, callback) {
      getCatalog({platformId: this.platformId, parentId: parentId}).then(res => {
        if (res.code === 0) {
          if (typeof (callback) === 'function') {
            callback(res.data)
          }
        }
      })
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        getPlatformById({platformId: this.platformId}).then(res => {
          if (res.code === 0) {
            this.platformName = res.data.name;
            this.defaultCatalogId = res.data.catalogId;
            this.defaultCatalogIdSign = res.data.catalogId;
            this.chooseId = res.data.catalogId;
            resolve([
              {
                name: this.platformName,
                id: this.platformId,
                type: 0
              }
            ]);
          }
        }).catch(err => console.log(err))
      }
      if (node.level >= 1) {
        this.getCatalog(node.data.id, resolve)
      }
    },

    nodeClickHandler(data, node, tree) {
      this.chooseId = data.id;
    },
    close() {
      this.showDialog = false;
    },
    submit() {
      if (this.catalogIdResult) this.catalogIdResult(this.chooseId)
      this.showDialog = false;
    },
  }
};
</script>

<style lang="less" scoped>
#catalogTree {
  display: inline-block;
}
</style>
