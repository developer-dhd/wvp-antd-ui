import request from '@/utils/request'

/**
 * 推流列表查询
 */
export function getStreamPushList(parameter) {
  return request({
    method: 'get',
    url: `/api/push/list`,
    params: parameter
  })
}

/**
 *
 * 根据应用名和流id获取播放地址
 */
export function getStreamInfoByAppAndStream(parameter) {
  return request({
    url: '/api/media/stream_info_by_app_and_stream',
    method: 'get',
    params: parameter
  })
}

/**
 * 中止一个推流
 */
export function stopPushRequest(parameter) {
  return request({
    url: '/api/push/stop',
    method: 'post',
    params: parameter
  })
}

/**
 * 将推流添加到国标
 */
export function pushSaveToGB(parameter) {
  return request({
    url: '/api/push/save_to_gb',
    method: 'post',
    data: parameter
  })
}

/**
 * 将推流移出到国标
 */
export function removeFromGBRequest(parameter) {
  return request({
    method: 'delete',
    url: '/api/push/remove_form_gb',
    data: parameter
  })
}

/**
 * 中止多个推流
 */
export function streamBatchStop(parameter){
  return request({
    method: 'delete',
    url: '/api/push/batchStop',
    data: parameter
  })
}
