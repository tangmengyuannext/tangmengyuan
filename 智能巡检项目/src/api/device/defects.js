import request from '@/utils/request'

// 查询缺陷 - 字典 列表
export function listDefects(query) {
  return request({
    url: '/device/defect/list',
    method: 'get',
    params: query
  })
}

// 查询缺陷列表 tree
export function listDefecttrees(query) {
  return request({
    url: '/device/defect/tree',
    method: 'get',
    params: query
  })
}

// 查询缺陷 - 字典 详细
export function getDefects(defectId) {
  return request({
    url: '/device/defect/' + defectId,
    method: 'get'
  })
}

// 新增缺陷 - 字典 
export function addDefects(data) {
  return request({
    url: '/device/defect',
    method: 'post',
    data: data
  })
}

// 修改缺陷 - 字典 
export function updateDefects(data) {
  return request({
    url: '/device/defect',
    method: 'put',
    data: data
  })
}

// 删除缺陷 - 字典 
export function delDefects(defectIds) {
  return request({
    url: '/device/defect/' + defectIds,
    method: 'delete'
  })
}

// 导出缺陷 - 字典 
export function exportDefects(query) {
  return request({
    url: '/device/defect/export',
    method: 'get',
    params: query
  })
}
