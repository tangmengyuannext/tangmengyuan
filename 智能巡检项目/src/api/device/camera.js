import request from '@/utils/request'

// 查询摄像头列表
export function listCamera(query) {
  return request({
    url: '/device/camera/list',
    method: 'get',
    params: query
  })
}

// 查询摄像头列表
export function listCameraArea(query) {
  return request({
    url: '/device/camera/area',
    method: 'get',
    params: query
  })
}

// 查询摄像头详细
export function getCamera(cameraId) {
  return request({
    url: '/device/camera/' + cameraId,
    method: 'get'
  })
}

// 新增摄像头
export function addCamera(data) {
  return request({
    url: '/device/camera',
    method: 'post',
    data: data
  })
}

// 修改摄像头
export function updateCamera(data) {
  return request({
    url: '/device/camera',
    method: 'put',
    data: data
  })
}

// 删除摄像头
export function delCamera(cameraId) {
  return request({
    url: '/device/camera/' + cameraId,
    method: 'delete'
  })
}

// 导出摄像头
export function exportCamera(query) {
  return request({
    url: '/device/camera/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/device/camera/importTemplate',
    method: 'get'
  })
}

//-------------直播推流---------------

export function getFrared(cameraId) {
  return request({
    url: '/col/frared/' + cameraId,
    method: 'get'
  })
}

export function getheart(cameraId){
  return request({
    url: '/col/frared/heart/' + cameraId,
    method: 'get'
  })
}