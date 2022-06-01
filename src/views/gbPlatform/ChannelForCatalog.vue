<template>
  <div>
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
      @node-contextmenu="contextmenuEventHandler"
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
    <catalog-edit ref="catalogEdit" :platform-id="platformId"/>
  </div>
</template>

<script>

import {catalogRelationDel, getCatalog, removeCatalog, setDefaultCatalog} from "@/api/gbPlatform";
import CatalogEdit from "./CatalogEdit";

export default {
  name: "ChannelForCatalog",
  props: ['platformId', 'platformName', 'defaultCatalogId', 'catalogIdChange'],
  components: {
    CatalogEdit
  },
  data() {
    return {
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      chooseId: '',
      chooseName: '',
      defaultCatalogIdSign: null
    }
  },

  // created() {
  //   this.chooseId = this.defaultCatalogId;
  //   this.defaultCatalogIdSign = this.defaultCatalogId;
  //   this.initData();
  //   setTimeout(() => {
  //     if (this.catalogIdChange) this.catalogIdChange(this.defaultCatalogId, this.platformName);
  //   }, 100)
  // },

  watch: {
    platformId(newData, oldData) {
      console.log(newData)
      this.initData()
    },
  },

  mounted() {
    this.chooseId = this.defaultCatalogId;
    this.defaultCatalogIdSign = this.defaultCatalogId;
    this.initData();
    if (this.catalogIdChange) this.catalogIdChange(this.defaultCatalogId, this.platformName);
  },

  methods: {
    initData: function () {
      this.getCatalog();
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        resolve([
          {
            name: "未分配",
            id: null,
            type: -1
          }, {
            name: this.platformName,
            id: this.platformId,
            type: 0
          }
        ]);
      }
      if (node.level >= 1) {
        this.getCatalog(node.data.id, resolve)
      }
    },

    contextmenuEventHandler(event, data, node, element) {
      if (node.data.type !== 0 && node.parent.data) {
        data.parentId = node.parent.data.id;
        this.$contextmenu({
          items: [
            {
              label: "移除通道",
              icon: "el-icon-delete",
              disabled: false,
              onClick: () => {
                catalogRelationDel().then(res => {
                  console.log("移除成功")
                  node.parent.loaded = false
                  node.parent.expand()
                }).catch(err => console.log(err))
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: "custom-class", // 自定义菜单 class
          zIndex: 3000, // 菜单样式 z-index
        });
      } else {
        this.$contextmenu({
          items: [
            {
              label: "刷新节点",
              icon: "el-icon-refresh",
              disabled: false,
              onClick: () => this.refreshCatalog(node)
            }, {
              label: "新建节点",
              icon: "el-icon-plus",
              disabled: false,
              onClick: () => this.addCatalog(data.id, node)
            }, {
              label: "修改节点",
              icon: "el-icon-edit",
              disabled: node.level === 1,
              onClick: () => this.editCatalog(data, node)
            }, {
              label: "删除节点",
              icon: "el-icon-delete",
              disabled: node.level === 1,
              divided: true,
              onClick: () => {
                this.$confirm({
                  title: '提示',
                  content: '确定删除?',
                  okText: '确定',
                  cancelText: '取消',
                  onOk() {
                    this.removeCatalog(data.id, node)
                  },
                  onCancel() {
                  },
                })
              }
            }, {
              label: "设为默认",
              icon: "el-icon-folder-checked",
              disabled: node.data.id === this.defaultCatalogIdSign,
              onClick: () => {
                this.setDefaultCatalog(data.id)
              },
            }
          ],
          event, // 鼠标事件信息
          customClass: "custom-class", // 自定义菜单 class
          zIndex: 3000, // 菜单样式 z-index
        });
      }
      return false;
    },

    nodeClickHandler: function (data, node, tree) {
      this.chooseId = data.id;
      this.chooseName = data.name;
      if (this.catalogIdChange) this.catalogIdChange(this.chooseId, this.chooseName);
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

    refreshCatalog(node) {
      node.loaded = false
      node.expand()
      this.$message.success('刷新成功')
    },

    addCatalog(parentId, node) {
      this.$refs.catalogEdit.openDialog(false, null, null, parentId, () => {
        //刷新tree
        node.loaded = false
        node.expand();
        this.$message.success('新增成功')
      });
    },

    editCatalog(data, node) {
      this.$refs.catalogEdit.openDialog(true, data.id, data.name, data.parentId, (newData) => {
        node.parent.loaded = false
        node.parent.expand();
        if (data.id === this.chooseId && newData.name !== data.name) {
          if (this.catalogIdChange) this.catalogIdChange(this.chooseId, newData.name);
        }
      });
    },

    removeCatalog(id, node) {
      removeCatalog({id: id, platformId: this.platformId}).then((res) => {
        console.log("移除返回: " + res)
        if (res.code === 0) {
          this.$message.success("移除成功")
          node.parent.loaded = false
          node.parent.expand();
          if (res.data) {
            this.defaultCatalogIdSign = res.data;
          }
        }
      }).catch(error => console.log(error)
      )
    },

    setDefaultCatalog(id) {
      setDefaultCatalog({platformId: this.platformId, catalogId: id}).then(res => {
        if (res.code === 0) {
          this.defaultCatalogIdSign = id
          this.$message.success('操作成功')
        }
      }).catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>
#catalogTree {
  display: inline-block;
}
</style>
