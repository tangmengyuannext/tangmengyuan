import request from '@/utils/request'

// 查询设备品牌型号列表
export function listBrand(query) {
  return request({
    url: '/device/brand/list',
    method: 'get',
    params: query
  })
}

// 查询设备品牌型号详细
export function getBrand(modelId) {
  return request({
    url: '/device/brand/' + modelId,
    method: 'get'
  })
}

// 新增设备品牌型号
export function addBrand(data) {
  return request({
    url: '/device/brand',
    method: 'post',
    data: data
  })
}

// 修改设备品牌型号
export function updateBrand(data) {
  return request({
    url: '/device/brand',
    method: 'put',
    data: data
  })
}

// 删除设备品牌型号
export function delBrand(modelId) {
  return request({
    url: '/device/brand/' + modelId,
    method: 'delete'
  })
}

// 导出设备品牌型号
export function exportBrand(query) {
  return request({
    url: '/device/brand/export',
    method: 'get',
    params: query
  })
}