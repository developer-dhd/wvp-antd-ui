<template>
  <a-modal
    :visible='showDialog'
    :title="isEdit?'节点编辑':'节点新增'"
    :confirm-loading="confirmLoading"
    @ok="onSubmit"
    @cancel="close">
    <a-form-model ref="form" :rules="rules" :model="form">
      <a-form-model-item label="节点编号" prop="id">
        <a-input v-model="form.id" :disabled="isEdit" placeholder="请输入节点编号" clearable/>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入节点名称" clearable/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import {addCatalog, editCatalog} from "@/api/gbPlatform";

const rules = {
  name: [{required: true, message: "请输入名称", trigger: "blur"}],
  id: [{required: true, message: "请输入ID", trigger: "blur"}]
}

const form = {
  id: null,
  name: null,
  platformId: null,
  parentId: null,
}

export default {
  name: "CatalogEdit",
  props: ['platformId'],
  data() {
    return {
      showDialog: false,
      confirmLoading: false,
      rules,
      form,
      isEdit: false,
      submitCallback: null
    };
  },
  methods: {

    openDialog(isEdit, id, name, parentId, callback) {
      console.log("parentId: " + parentId)
      this.isEdit = isEdit;
      this.form.id = id;
      this.form.name = name;
      this.form.platformId = this.platformId;
      this.form.parentId = parentId;
      this.showDialog = true;
      this.submitCallback = callback;
    },

    onSubmit() {
      console.log(this.form);
      if (this.isEdit) {
        editCatalog(this.form).then(res => {
          if (res.code === 0) {
            if (this.submitCallback) this.submitCallback(this.form)
          } else {
            this.$message.error('error')
          }
          this.close();
        }).catch(err => console.log(err))
      } else {
        addCatalog(this.form).then(res => {
          if (res.code === 0) {
            if (this.submitCallback) this.submitCallback(this.form)
          } else {
            this.$message.error('error')
          }
          this.close();
        }).catch(err => console.log(err))
      }
    },

    close() {
      this.showDialog = false;
      this.$refs.form.resetFields();
    }
  },
};
</script>
