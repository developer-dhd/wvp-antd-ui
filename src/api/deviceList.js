import request from '@/utils/request'

/**
 * 获取设备列表
 */
export function getDeviceList(parameter) {
  return request({
    url: '/api/device/query/devices',
    method: 'get',
    params: parameter
  })
}

/**
 * 分页查询通道数
 */
export function getDeviceChannelList(parameter) {
  return request({
    url: `/api/device/query/devices/${parameter.deviceId}/channels`,
    method: 'get',
    params: parameter
  })
}

/**
 * 显示子通道
 */
export function showSubChannels(parameter){
  return request({
    url: `/api/device/query/sub_channels/${parameter.deviceId}/${parameter.parentChannelId}/channels`,
    method: 'get',
    params: parameter
  })
}

/**
 * 通知设备推流
 */
export function noticePushStream(parameter) {
  return request({
    url: '/api/play/start/' + parameter.deviceId + '/' + parameter.channelId,
    method: 'get'
  })
}

/**
 * 关闭流
 */
export function stopDevicePush(parameter) {
  return request({
    url: '/api/play/stop/' + parameter.deviceId + '/' + parameter.channelId,
    method: 'get',
    params: parameter
  })
}

/**
 * 使用ID查询国标设备
 */
export function queryGBDeviceById(parameter) {
  return request({
    url: `/api/device/query/devices/${parameter.deviceId}/sync`,
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑设备信息
 */
export function updateDeviceInfo(parameter) {
  return request({
    url: '/api/device/query/device/update/',
    method: 'post',
    params: parameter
  })
}

/**
 * 查询设备的历史定位点
 */
export function positionHistory(parameter) {
  return request({
    url: `/api/position/history/${parameter.deviceId}/${parameter.channelId}`,
    method: 'get',
    params: parameter
  })
}

/**
 * 查询设备最新位置
 */
export function queryLatestPosition(parameter) {
  return request({
    url: '/api/position/latest/' + parameter.deviceId,
    method: 'get'
  })
}

/**
 * 位置订阅
 */
export function subscribePosition(parameter) {
  return request({
    url: '/api/position/subscribe/' + parameter.deviceId,
    method: 'get',
    params: parameter
  })
}

/**
 * 云台控制
 */
export function ptzController(parameter) {
  return request({
    url: '/api/ptz/front_end_command/' + parameter.deviceId + '/' + parameter.channelId + '?cmdCode=' + parameter.cmdCode + '&parameter1=' + parameter.parameter1 + '&parameter2=' + parameter.parameter2 + '&combindCode2=' + parameter.combindCode2,
    method: 'post',
    data: parameter
  })
}

/**
 * 云台轮盘控制
 */
export function ptzCamera(parameter) {
  return request({
    url: '/api/ptz/control/' + parameter.deviceId + '/' + parameter.channelId + '?command=' + parameter.command + '&horizonSpeed=' + parameter.horizonSpeed + '&verticalSpeed=' + parameter.verticalSpeed + '&zoomSpeed=' + parameter.zoomSpeed,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取媒体信息
 */
export function getMediaInfo(parameter) {
  return request({
    url: '/zlm/' + parameter.mediaServerId + '/index/api/getMediaInfo?vhost=__defaultVhost__&schema=rtmp&app=' + parameter.app + '&stream=' + parameter.streamId,
    method: 'get'
  })
}

/**
 * 转码播放
 */
export function coverPlay(parameter) {
  return request({
    url: '/api/play/convert/' + parameter.streamId,
    method: 'post',
    data: parameter
  })
}

/**
 * 停止转码
 */
export function convertStop(parameter) {
  return request({
    url: '/api/play/convertStop/' + parameter.convertKey + '/' + parameter.mediaServerId,
    method: 'post',
    data: parameter
  })
}

/**
 * 音频开关
 */
export function updateChannel(parameter) {
  return request({
    url: '/api/device/query/channel/update/' + parameter.deviceId,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除离线设备
 */
export function deleteDevice(parameter) {
  return request({
    url: '/api/device/query/devices/' + parameter.deviceId + '/delete',
    method: 'delete'
  })
}

/**
 * 国标协议查询录像 NVR
 */
export function queryRecords(parameter) {
  return request({
    url: '/api/gb_record/query/' + parameter.deviceId + '/' + parameter.channelId + '?startTime=' + parameter.startTime + '&endTime=' + parameter.endTime,
    method: 'get'
  })
}

/**
 * 点播NVR上的录像
 */
export function startPlayRecord(parameter) {
  return request({
    url: '/api/playback/start/' + parameter.deviceId + '/' + parameter.channelId,
    method: 'get',
    params: parameter
  })
}

/**
 * 停止播放NVR录像
 */
export function stopPlayRecord(parameter) {
  return request({
    url: '/api/playback/stop/' + parameter.deviceId + '/' + parameter.channelId + '/' + parameter.streamId,
    method: 'get'
  })
}

/**
 * 下载NVR录像
 */
export function downloadRecord(parameter) {
  return request({
    url: '/api/gb_record/download/start/' + parameter.deviceId + '/' + parameter.channelId,
    method: 'get',
    params: parameter
  })
}

/**
 * 停止下载NVR录像
 */
export function stopDownloadRecord(parameter) {
  return request({
    url: '/api/gb_record/download/stop/' + parameter.deviceId + '/' + parameter.channelId + '/' + parameter.streamId,
    method: 'get'
  })
}

/**
 * 添加视频合成下载任务
 */
export function getFileDownload(parameter) {
  return request({
    method: 'get',
    url: '/record_proxy/' + parameter.mediaServerId + '/api/record/file/download/task/add',
    params: parameter
  })
}

/**
 * 获取视频合成后下载列表
 */
export function getProgressForFile(parameter) {
  return request({
    method: 'get',
    url: '/record_proxy/' + parameter.mediaServerId + '/api/record/file/download/task/list',
    params: parameter
  })
}

/**
 * 获取历史媒体下载进度
 */
export function getProgressRequest(parameter) {
  return request({
    method: 'get',
    url: '/api/gb_record/download/progress/' + parameter.deviceId + '/' + parameter.channelId + '/' + parameter.streamId,
    params: parameter
  })
}

/**
 * 修改传输方式
 */
export function transportChangeRequest(parameter){
  return request({
    method: 'post',
    url: '/api/device/query/transport/' + parameter.deviceId + '/' + parameter.streamMode,
    data: parameter
  })
}

/**
 * 查询设备通道同步状态
 */
export function queryDeviceChannelSync(parameter){
  return request({
    method: 'get',
    url: `/api/device/query/${parameter.deviceId}/sync_status/`,
    params: parameter
  })
}

/**
 * 设置nvr录像播放倍速
 */
export function setPlaybackSpeed(parameter){
  return request({
    method: 'get',
    url: `/api/playback/speed/${parameter.streamId }/${parameter.command}`,
    params: parameter
  })
}

/**
 * 暂停录像播放
 */
export function pausePlayback(parameter){
  return request({
    method: 'get',
    url: '/api/playback/pause/' + parameter.streamId,
    params: parameter
  })
}

/**
 * 恢复录像播放
 */
export function resumePlayback(parameter){
  return request({
    method: 'get',
    url: '/api/playback/resume/' + parameter.streamId,
    params: parameter
  })
}

/**
 * 录像回放seek
 */
export function setPlaybackGbSeek(parameter){
  return request({
    method: 'get',
    url: `/api/playback/seek/${parameter.streamId }/${parameter.seekTime}`,
    params: parameter
  })
}

