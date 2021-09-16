import request from '@/utils/request'

// 查询缺陷 - 字典 列表
export function listDefect(query) {
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

// 根据缺陷大类查询对应得缺陷tree
export function getDefectTreeByType(defectTypeId) {
  return request({
    url: '/device/defect/getDefectTreeByType/' + defectTypeId,
    method: 'get'
  })
}

// 查询缺陷 - 字典 详细
export function getDefect(defectId) {
  return request({
    url: '/device/defect/' + defectId,
    method: 'get'
  })
}

// 新增缺陷 - 字典
export function addDefect(data) {
  return request({
    url: '/device/defect',
    method: 'post',
    data: data
  })
}

// 修改缺陷 - 字典
export function updateDefect(data) {
  return request({
    url: '/device/defect',
    method: 'put',
    data: data
  })
}

// 删除缺陷 - 字典
export function delDefect(defectIds) {
  return request({
    url: '/device/defect/' + defectIds,
    method: 'delete'
  })
}

// 导出缺陷 - 字典
export function exportDefect(query) {
  return request({
    url: '/device/defect/export',
    method: 'get',
    params: query
  })
}
