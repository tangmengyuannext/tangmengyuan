import request from '@/utils/request'

// 查询大华摄像头列表
export function listDHCamera(query) {
  return request({
    url: '/device/surveillanceCamera/list',
    method: 'get',
    params: query
  })
}

// 修改大华摄像头
export function updateDHCamera(data) {
  return request({
    url: '/device/surveillanceCamera',
    method: 'put',
    data: data
  })
}

// 新增大华摄像头
export function addDHCamera(data) {
  return request({
    url: '/device/surveillanceCamera',
    method: 'post',
    data: data
  })
}

// 大华摄像头详情
export function dhCameraDetails(cameraId) {
  return request({
    url: '/device/surveillanceCamera/' + cameraId,
    method: 'get'
  })
}

// 删除大华摄像头
export function deleteDHCamera(cameraId) {
  return request({
    url: '/device/surveillanceCamera/' + cameraId,
    method: 'delete'
  })
}