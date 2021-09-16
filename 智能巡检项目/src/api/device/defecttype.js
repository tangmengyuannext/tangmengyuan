import request from '@/utils/request'

// 查询缺陷类型 - 字典 列表
export function listDefecttype(query) {
  return request({
    url: '/device/defectType/list',
    method: 'get',
    params: query
  })
}

// 查询缺陷类型 - 字典 详细
export function getDefecttype(defecttypeId) {
  return request({
    url: '/device/defectType/' + defecttypeId,
    method: 'get'
  })
}

// 新增缺陷类型 - 字典
export function addDefecttype(data) {
  return request({
    url: '/device/defectType',
    method: 'post',
    data: data
  })
}

// 修改缺陷类型 - 字典
export function updateDefecttype(data) {
  return request({
    url: '/device/defectType',
    method: 'put',
    data: data
  })
}

// 删除缺陷类型 - 字典
export function delDefecttype(defecttypeId) {
  return request({
    url: '/device/defectType/' + defecttypeId,
    method: 'delete'
  })
}

// 导出缺陷类型 - 字典
export function exportDefecttype(query) {
  return request({
    url: '/device/defectType/export',
    method: 'get',
    params: query
  })
}
