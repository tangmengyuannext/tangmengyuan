import request from '@/utils/request'

// 查询服务器列表
export function listServer(query) {
  return request({
    url: '/device/server/list',
    method: 'get',
    params: query
  })
}

// 查询服务器详细
export function getServer(serverId) {
  return request({
    url: '/device/server/' + serverId,
    method: 'get'
  })
}

// 新增服务器
export function addServer(data) {
  return request({
    url: '/device/server',
    method: 'post',
    data: data
  })
}

// 修改服务器
export function updateServer(data) {
  return request({
    url: '/device/server',
    method: 'put',
    data: data
  })
}

// 删除服务器
export function delServer(serverId) {
  return request({
    url: '/device/server/' + serverId,
    method: 'delete'
  })
}

// 导出服务器
export function exportServer(query) {
  return request({
    url: '/device/server/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/device/server/importTemplate',
    method: 'get'
  })
}