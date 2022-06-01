<template>
  <div class="main" style="padding: 0 20px">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit">

      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="账号"
          v-decorator="['username',{rules: [{ required: true, message: '请输入帐户名'}]}]">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码"
          autocomplete="false"
          v-decorator="['password',{rules: [{ required: true, message:'请输入密码'}]}]">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
        <a-button type="link" class="forge-password" @click = "$message.warn('请联系管理员')">
          忘记密码
        </a-button>
      </a-form-item>

      <a-form-item style="margin-top:0">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          :disabled="loginBtn"
        >登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import {mapActions} from 'vuex'
import {timeFix} from '@/utils/util'

export default {
  data() {
    return {
      loginBtn: false,
      form: this.$form.createForm(this),
    }
  },
  created() {

  },
  methods: {
    ...mapActions(['Login', 'Logout']),

    handleSubmit(e) {
      e.preventDefault()
      const {validateFields} = this.form
      this.loginBtn = true
      validateFields({force: true}, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = {...values}
          loginParams.password = md5(values.password)
          this.Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => {
              this.$message.error("登录失败: "+ err)
            }).finally(() => {
              this.loginBtn = false
            })
        } else {
          setTimeout(() => {
            this.loginBtn = false
          }, 600)
        }
      })
    },

    loginSuccess(res) {
      console.log(res)
      this.$router.push({path: '/'})
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
    float: right;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
