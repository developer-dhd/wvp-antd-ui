import request from '@/utils/request'

/**
 *
 *分页查询级联平台
 */
export function getPlatformList(parameter) {
  return request({
    url: `/api/platform/query/${parameter.count}/${parameter.page}`,
    method: 'get'
  })
}

/**
 *
 * 获取国标服务的配置
 */
export function getPlatformServerConf() {
  return request({
    url: '/api/platform/server_config',
    method: 'get'
  })
}

/**
 *
 * 保存上级平台信息
 */
export function savePlatform(parameter) {
  return request({
    url: parameter.requestUrl,
    method: 'post',
    data: parameter
  })
}

/**
 *
 * 查询上级平台是否存在
 */
export function exitPlatform(parameter) {
  return request({
    url: '/api/platform/exit/' + parameter.deviceGbId,
    method: 'get'
  })
}

/**
 *
 *删除上级平台
 */
export function deletePlatformCommit(parameter) {
  return request({
    url: '/api/platform/delete/' + parameter.serverGBId,
    method: 'delete'
  })
}

/**
 *
 * 分页查询级联平台的所有所有通道
 */
export function getChannelList(parameter) {
  return request({
    url: '/api/platform/channel_list',
    method: 'get',
    params: parameter
  })
}

/**
 *
 * 向上级平台添加国标通道
 */
export function updateChannelForGB(parameter) {
  return request({
    url: '/api/platform/update_channel_for_gb',
    method: 'post',
    data: parameter
  })
}

/**
 *
 * 从上级平台移除国标通道
 */
export function delChannelForGB(parameter) {
  return request({
    url: '/api/platform/del_channel_for_gb',
    method: 'delete',
    data: parameter
  })
}

/**
 *
 * 查询国标通道
 */
export function queryGbChannel(parameter) {
  return request({
    url: '/api/gbStream/list',
    method: 'get',
    params: parameter
  })
}

/**
 *
 * 获取目录
 */
export function getCatalog(parameter) {
  return request({
    url: '/api/platform/catalog',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增目录
 */
export function addCatalog(parameter) {
  return request({
    url: `/api/platform/catalog/add`,
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑目录
 */
export function editCatalog(parameter) {
  return request({
    url: `/api/platform/catalog/edit`,
    method: 'post',
    data: parameter
  })
}

/**
 *
 * 删除目录
 */
export function removeCatalog(parameter) {
  return request({
    url: `/api/platform/catalog/del`,
    method: 'delete',
    params: parameter
  })
}

/**
 * 移除通道
 */
export function catalogRelationDel(parameter){
  return request({
    method:"delete",
    url:"/api/platform/catalog/relation/del",
    data: parameter
  })
}

/**
 *
 * 设置默认目录
 */
export function setDefaultCatalog(parameter) {
  return request({
    url: `/api/platform/catalog/default/update`,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除国标通道
 */
export function deleteChannelForGB(parameter) {
  return request({
    url: `/api/platform/del_channel_for_gb`,
    method: 'delete',
    data: parameter
  })
}

/**
 * 通过platformId获取信息
 */
export function getPlatformById(parameter) {
  return request({
    url: `/api/platform/info/` + parameter.platformId,
    method: 'get',
    params: parameter
  })
}

/**
 * 批量删除直播流
 */
export function gbStreamDel(parameter) {
  return request({
    url: `/api/gbStream/del`,
    method: 'delete',
    data: parameter
  })
}

/**
 * 批量增加直播流
 */
export function gbStreamAdd(parameter) {
  return request({
    url: `/api/gbStream/add`,
    method: 'post',
    data: parameter
  })
}
