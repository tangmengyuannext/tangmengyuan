import request from '@/utils/request'

// 查询设备列表
export function listDevice(query) {
  return request({
    url: '/system/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备列表（排除节点）
export function listDeviceExcludeChild(deviceId) {
  return request({
    url: '/system/device/list/exclude/' + deviceId,
    method: 'get'
  })
}

// 查询设备详细
export function getDevice(deviceId) {
  return request({
    url: '/system/device/' + deviceId,
    method: 'get'
  })
}

// 查询设备下拉树结构
export function treeselect() {
  return request({
    url: '/system/device/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询设备树结构
export function roleDeviceTreeselect(roleId) {
  return request({
    url: '/system/device/roleDeviceTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增设备
export function addDevice(data) {
  return request({
    url: '/system/device',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateDevice(data) {
  return request({
    url: '/system/device',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delDevice(deviceId) {
  return request({
    url: '/system/device/' + deviceId,
    method: 'delete'
  })
}