import request from '@/utils/request'

// 查询设备部件 - 字典 列表
export function listEquipmentunit(query) {
  return request({
    url: '/device/equipment/list',
    method: 'get',
    params: query
  })
}

// 查询设备部件 - 字典 详细
export function getEquipmentunit(equipmentId) {
  return request({
    url: '/device/equipment/' + equipmentId,
    method: 'get'
  })
}

// 新增设备部件 - 字典 
export function addEquipmentunit(data) {
  return request({
    url: '/device/equipment',
    method: 'post',
    data: data
  })
}

// 修改设备部件 - 字典 
export function updateEquipmentunit(data) {
  return request({
    url: '/device/equipment',
    method: 'put',
    data: data
  })
}

// 删除设备部件 - 字典 
export function delEquipmentunit(equipmentId) {
  return request({
    url: '/device/equipment/' + equipmentId,
    method: 'delete'
  })
}

// 导出设备部件 - 字典 
export function exportEquipmentunit(query) {
  return request({
    url: '/device/equipment/export',
    method: 'get',
    params: query
  })
}
