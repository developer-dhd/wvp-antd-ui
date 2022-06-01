<template>
  <a-modal
    title="设备信息编辑"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="设备编号">
          <a-input placeholder='请输入设备编号' v-decorator="['deviceId']" disabled/>
        </a-form-item>
        <a-form-item label="设备名称">
          <a-input
            placeholder='请输入设备名称'
            v-decorator="['name',{rules:[{required: true, min:2, max:255,message:'只能输入2-255个字符'}]}]"/>
        </a-form-item>
        <a-form-item label="字符集">
          <a-select
            v-decorator="['charset',{rules: [{required:false, message: '请选择字符集'}]}]"
            placeholder='请选择字符集'
            style="width: 100%">
            <a-select-option value="gb2312">GB2312</a-select-option>
            <a-select-option value="utf-8">UTF-8</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="目录订阅">
          <a-select
            v-decorator="['subscribeCycleForCatalog', {rules: [{required: false, message: '请选择是否订阅目录'}]}]"
            placeholder='请选择是否订阅目录'
            style="width: 100%">
            <a-select-option :value="0">不订阅</a-select-option>
            <a-select-option :value="1">订阅</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="移动位置订阅">
          <a-select
            v-decorator="['subscribeCycleForMobilePosition', {rules: [{required: false, message: '请选择是否订设备位置'}]}]"
            placeholder='请选择是否订设备位置'
            style="width: 100%">
            <a-select-option :value="0">不订阅</a-select-option>
            <a-select-option :value="1">订阅</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="subscribeMobilePosition > 0" label="移动位置报送间隔">
          <a-input
            placeholder="请输入移动位置报送间隔"
            v-decorator="['mobilePositionSubmissionInterval',{rules: [{required: false, message: '请输入移动位置报送间隔'}]}]"/>
        </a-form-item>
        <a-form-item label="其他选项">
          <a-checkbox
            placeholder="请选择是否进行SSRC校验"
            v-decorator="['ssrcCheck',{valuePropName: 'checked', rules: [{required: false, message: '请选择是否进行SSRC校验'}]}]">
            SSRC校验
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = [
  'deviceId',
  'name',
  'charset',
  'subscribeCycleForCatalog',
  'subscribeCycleForMobilePosition',
  'mobilePositionSubmissionInterval',
  'ssrcCheck'
]

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 13}
      }
    }
    return {
      form: this.$form.createForm(this),
      subscribeMobilePosition: 0
    }
  },
  created() {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      //console.log(this.model)
      this.subscribeMobilePosition = this.model.subscribeCycleForMobilePosition
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
