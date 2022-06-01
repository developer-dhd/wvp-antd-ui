import router from './router'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import {domTitle, setDocumentTitle} from '@/utils/domUtil'
import {ACCESS_TOKEN} from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const allowList = ['login'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

//导航守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({path: defaultRoutePath})
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({path: loginRoutePath, query: {redirect: to.fullPath}})
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
