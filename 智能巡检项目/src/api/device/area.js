import request from '@/utils/request'

// 查询区域列表
export function listArea(query) {
  return request({
    url: '/device/area/list',
    method: 'get',
    params: query
  })
}

// 查询区域列表（排除节点）
export function listAreaExcludeChild(areaId) {
  return request({
    url: '/device/area/list/exclude/' + areaId,
    method: 'get'
  })
}

// 查询区域详细
export function getArea(areaId) {
  return request({
    url: '/device/area/' + areaId,
    method: 'get'
  })
}

// 查询区域下拉树结构
export function treeselect() {
  return request({
    url: '/device/area/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询区域树结构
export function userAreaTreeselect(userId) {
  return request({
    url: '/device/area/userAreaTreeselect/' + userId,
    method: 'get'
  })
}

// 新增区域
export function addArea(data) {
  return request({
    url: '/device/area',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateArea(data) {
  return request({
    url: '/device/area',
    method: 'put',
    data: data
  })
}

// 删除区域
export function delArea(areaId) {
  return request({
    url: '/device/area/' + areaId,
    method: 'delete'
  })
}