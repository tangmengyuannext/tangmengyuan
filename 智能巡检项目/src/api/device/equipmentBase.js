import request from '@/utils/request'

// 查询被采设备 - 字典 列表
export function listEquipmentBase(query) {
  return request({
    url: '/device/equipmentBase/list',
    method: 'get',
    params: query
  })
}

// 查询被采设备 - 字典 详细
export function getEquipmentBase(equipmentBaseId) {
  return request({
    url: '/device/equipmentBase/' + equipmentBaseId,
    method: 'get'
  })
}

// 新增被采设备 - 字典 
export function addEquipmentBase(data) {
  return request({
    url: '/device/equipmentBase',
    method: 'post',
    data: data
  })
}

// 修改被采设备 - 字典 
export function updateEquipmentBase(data) {
  return request({
    url: '/device/equipmentBase',
    method: 'put',
    data: data
  })
}

// 删除被采设备 - 字典 
export function delEquipmentBase(equipmentBaseId) {
  return request({
    url: '/device/equipmentBase/' + equipmentBaseId,
    method: 'delete'
  })
}

// 导出被采设备 - 字典 
export function exportEquipmentBase(query) {
  return request({
    url: '/device/equipmentBase/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/device/equipmentBase/importTemplate',
    method: 'get'
  })
}

// 配置缺陷
export function configEquipmentDefect(data) {
  return request({
    url: '/device/equipmentBase/configEquipmentDefect',
    method: 'post',
    data: data
  })
}