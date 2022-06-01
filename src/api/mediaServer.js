import request from '@/utils/request'

/**
 * 流媒体服务列表
 */
export function getMediaServerList() {
  return request({
    url: `/api/server/media_server/list`,
    method: 'get'
  })
}

/**
 *
 * 测试流媒体服务
 */
export function checkServer(parameter) {
  return request({
    url: `/api/server/media_server/check`,
    method: 'get',
    params: parameter
  })
}

/**
 *
 * 测试流媒体录像管理服务
 */
export function checkRecordServer(parameter) {
  return request({
    url: `/api/server/media_server/record/check`,
    method: 'get',
    params: parameter
  })
}

/**
 *
 * 保存流媒体服务
 */
export function addServer(parameter) {
  return request({
    url: `/api/server/media_server/save`,
    method: 'post',
    data: parameter
  })
}

/**
 *
 * 移除流媒体服务
 */
export function deleteServer(parameter) {
  return request({
    url: `/api/server/media_server/delete`,
    method: 'delete',
    params: parameter
  })
}

/**
 * 获取在线的流媒体服务器列表
 */
export function getOnlineMediaServerList(parameter) {
  return request({
    url: `/api/server/media_server/online/list`,
    method: 'get',
    params: parameter
  })
}
