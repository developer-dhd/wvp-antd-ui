<template>
  <div>
    <a-modal
      title="导入通道数据"
      width="30rem"
      :visible="showDialog"
      @cancel="close">
      <div>
        <el-upload
          class="upload-box"
          drag
          :action="uploadUrl"
          name="file"
          :on-success="successHook"
          :on-error="errorHook"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传 csv / xls / xlsx 文件</div>
        </el-upload>
      </div>
    </a-modal>
    <import-channel-show-error-data ref="showErrorData" :gbIds="errorGBIds" :streams="errorStreams"/>
  </div>
</template>

<script>

import ImportChannelShowErrorData from "./ImportChannelShowErrorData";

export default {
  name: "ImportChannel",
  components: {
    ImportChannelShowErrorData,
  },
  data() {
    return {
      submitCallback: null,
      showDialog: false,
      isEdit: false,
      errorStreams: [],
      errorGBIds: [],
      uploadUrl: process.env.NODE_ENV === 'development' ? `debug/api/push/upload` : `api/push/upload`,
    };
  },
  methods: {
    open(callback) {
      this.showDialog = true
      this.submitCallback = callback
    },

    close() {
      this.showDialog = false
    },

    successHook(response, file, fileList) {
      if (response.code === 0) {
        this.$message.success(response.msg)
      } else if (response.code === 1) {
        this.errorGBIds = response.data.gbId
        this.errorStreams = response.data.stream
        this.$refs.showErrorData.openDialog()
      } else {
        this.$message.error(response.msg)
      }
    },

    errorHook(err, file, fileList) {
      this.$message.error(err)
    }
  },
}
</script>
<style lang="less" scoped>
.upload-box {
  text-align: center;
}
</style>
