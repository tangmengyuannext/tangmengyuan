import request from '@/utils/request'

// 查询车辆摄像头信息列表
export function listCarCamera(query) {
    return request({
        url: '/car/camera/list',
        method: 'get',
        params: query
    })
}

// 查询车辆摄像头信息详情
export function getCarCamera(cameraId) {
    return request({
        url: '/car/camera/' + cameraId,
        method: 'get'
    })
}

// 新增车辆摄像头信息
export function addCarCamera(data) {
    return request({
        url: '/car/camera',
        method: 'post',
        data: data
    })
}

// 修改车辆摄像头信息
export function updateCarCamera(data) {
    return request({
        url: '/car/camera',
        method: 'put',
        data: data
    })
}

// 删除车辆摄像头信息
export function delCarCamera(cameraId) {
    return request({
        url: '/car/camera/' + cameraId,
        method: 'delete'
    })
}


