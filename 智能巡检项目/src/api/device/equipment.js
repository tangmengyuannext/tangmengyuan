import request from '@/utils/request'

// 查询区域列表
export function listEquipment(query) {
  return request({
    url: '/device/equipment/list',
    method: 'get',
    params: query
  })
}

// 查询区域列表（排除节点）
export function listEquipmentExcludeChild(equipmentId) {
  return request({
    url: '/device/equipment/list/exclude/' + equipmentId,
    method: 'get'
  })
}

// 查询区域详细
export function getEquipment(equipmentId) {
  return request({
    url: '/device/equipment/' + equipmentId,
    method: 'get'
  })
}

// 查询区域下拉树结构
export function treeselect() {
  return request({
    url: '/device/equipment/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询区域树结构
export function userEquipmentTreeselect(userId) {
  return request({
    url: '/device/equipment/userEquipmentTreeselect/' + userId,
    method: 'get'
  })
}

// 新增区域
export function addEquipment(data) {
  return request({
    url: '/device/equipment',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateEquipment(data) {
  return request({
    url: '/device/equipment',
    method: 'put',
    data: data
  })
}

// 删除区域
export function delEquipment(equipmentId) {
  return request({
    url: '/device/equipment/' + equipmentId,
    method: 'delete'
  })
}