import storage from 'store'
import {login, logout} from '@/api/login'
import {ACCESS_TOKEN, USER_INFO} from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
    },
    SET_INFO: (state, info) => {
      state.info = info
      storage.set(USER_INFO, info)
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === 0 && response.msg === 'success') {
            let token = response.data.username //token标识设定为username
            commit('SET_TOKEN', token)
            commit('SET_INFO', response.data)
            resolve()
          } else {
            reject(response.msg)
          }
        }).catch(error => {
          reject('认证失败，请确认账号密码正确！')
        })
      })
    },

    // 登出
    Logout({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_INFO', null)
          storage.remove(ACCESS_TOKEN)
          storage.remove(USER_INFO)
          window.location.reload()
        }).catch((err) => {
          reject('登出失败: ' + err)
        })
      })
    }

  }
}

export default user
