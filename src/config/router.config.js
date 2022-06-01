// eslint-disable-next-line
import {BasicLayout, UserLayout} from '@/layouts'
import {bxAnaalyse} from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

/**
 * 基础路由
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/monitor',
    children: [
      // 服务监控
      {
        path: '/dashboard',
        name: 'Dashboard',
        redirect: '/dashboard/monitor',
        component: RouteView,
        meta: {title: '仪表盘', keepAlive: true, icon: bxAnaalyse},
        children: [
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            component: () => import('@/views/dashboard/MonitorIndex'),
            meta: {title: '控制台', keepAlive: false}
          }
        ]
      },
      // 视频广场
      {
        path: '/videoMatrix',
        name: 'VideoMatrix',
        component: RouteView,
        redirect: '/video/videoMatrix',
        meta: {title: '视频广场', icon: 'appstore'},
        children: [
          {
            path: '/video/videoMatrix',
            name: 'VideoMatrixSquare',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/videoSquare/squareIndex'),
            meta: {title: '视频矩阵'}
          }
        ]
      },
      // 设备管理
      {
        path: '/deviceManage',
        name: 'DeviceManage',
        component: RouteView,
        redirect: '/video/deviceList',
        meta: {title: '设备管理', icon: 'video-camera'},
        children: [
          {
            path: '/video/deviceList',
            name: 'DeviceList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/device/DeviceIndex'),
            meta: {title: '设备列表'}
          }
        ]
      },
      // 录像管理
      {
        path: '/recordManage',
        name: 'RecordManage',
        component: RouteView,
        redirect: '/video/recordList',
        meta: {title: '云端录像', icon: 'unordered-list'},
        children: [
          {
            path: '/video/recordList',
            name: 'RecordList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/records/RecordIndex'),
            meta: {title: '设备录像列表'}
          },
          {
            path: '/video/nvrRecordIndex',
            name: 'NVRecordIndex',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/records/NVRRecordIndex'),
            meta: {title: 'NVR录像列表'}
          }
        ]
      },
      // 拉流代理
      {
        path: '/streamProxy',
        name: 'StreamProxy',
        component: RouteView,
        redirect: '/stream/proxy',
        meta: {title: '拉流代理', icon: 'deployment-unit'},
        children: [
          {
            path: '/stream/proxy',
            name: 'StreamProxyList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/streamProxy/StreamProxyList'),
            meta: {title: '代理列表'}
          }
        ]
      },
      // 推流管理
      {
        path: '/streamPushManage',
        name: 'StreamPushManage',
        component: RouteView,
        redirect: '/stream/pushList',
        meta: {title: '推流管理', icon: 'deployment-unit'},
        children: [
          {
            path: '/stream/pushList',
            name: 'StreamPushList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/push/StreamPushList'),
            meta: {title: '推流列表'}
          }
        ]
      },
      {
        path: '/gbPlatform',
        name: 'GbPlatform',
        component: RouteView,
        redirect: '/gbPlatform/index',
        meta: {title: '国标级联', icon: 'apartment'},
        children: [
          {
            path: '/gbPlatform/index',
            name: 'GbPlatformIndex',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/gbPlatform/GbPlatformIndex'),
            meta: {title: '上级平台列表'}
          }
        ]
      },
      // 预警列表
      {
        path: '/deviceWarning',
        name: 'DeviceWarning',
        component: RouteView,
        redirect: '/device/warning',
        meta: {title: '报警管理', icon: 'bell'},
        children: [
          {
            path: '/device/warning',
            name: 'WarningList',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/warning/WarningList'),
            meta: {title: '报警列表'}
          }
        ]
      },
      {
        path: '/mediaServer',
        name: 'MediaServer',
        component: RouteView,
        redirect: '/mediaServer/index',
        meta: {title: '节点管理', icon: 'cloud-server'},
        children: [
          {
            path: '/mediaServer/index',
            name: 'MediaServerIndex',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/mediaServer/MediaServerIndex'),
            meta: {title: '流媒体节点列表'}
          }
        ]
      }
    ]
  },

  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
