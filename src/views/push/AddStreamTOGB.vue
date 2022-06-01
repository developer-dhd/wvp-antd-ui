<template>
  <a-modal
    title="加入国标"
    width="40%"
    :visible="showDialog"
    @ok="onSubmit"
    @cancel="close">
    <a-form-model ref="streamProxy" :rules="rules" :model="proxyParam">
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="proxyParam.name" clearable></a-input>
      </a-form-model-item>
      <a-form-model-item label="流应用名" prop="app">
        <a-input v-model="proxyParam.app" clearable :disabled="true"></a-input>
      </a-form-model-item>
      <a-form-model-item label="流ID" prop="stream">
        <a-input v-model="proxyParam.stream" clearable :disabled="true"></a-input>
      </a-form-model-item>
      <a-form-model-item label="国标编码" prop="gbId">
        <a-input v-model="proxyParam.gbId" placeholder="设置国标编码可推送到国标" clearable></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {pushSaveToGB} from "@/api/streamPush";

export default {
  name: "AddStreamTOGB",
  data() {
    return {
      listChangeCallback: null,
      showDialog: false,
      proxyParam: {
        name: null,
        app: null,
        stream: null,
        gbId: null,
      },
      rules: {
        name: [{required: true, message: "请输入名称", trigger: "blur"}],
        app: [{required: true, message: "请输入应用名", trigger: "blur"}],
        stream: [{required: true, message: "请输入流ID", trigger: "blur"}],
        gbId: [{required: true, message: "请输入国标编码", trigger: "blur"}],
      },
    }
  },
  methods: {
    open(proxyParam, callback) {
      this.showDialog = true;
      this.listChangeCallback = callback;
      if (proxyParam != null) {
        this.proxyParam = proxyParam;
      }
    },
    onSubmit: function () {
      console.log("onSubmit")
      pushSaveToGB(this.proxyParam).then(res => {
        if (res === "success") {
          this.$message.success("保存成功")
          this.showDialog = false
          if (this.listChangeCallback != null) this.listChangeCallback();
        }
      }).catch(err => console.log(err))
    },

    close() {
      console.log("关闭加入GB");
      this.showDialog = false;
      this.$refs.streamProxy.resetFields();
    }
  },
}
</script>
