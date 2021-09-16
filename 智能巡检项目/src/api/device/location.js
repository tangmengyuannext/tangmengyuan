import request from '@/utils/request'

// 获取指定区域/设备智能感知设备列表
export function cameraLocationList(query) {
    return request({
        url: '/device/location/cameraList',
        method: 'get',
        params: query
    })
}

// 获取指定区域/设备智能感知设备列表(不分页)
export function getCameraLocationList(query) {
    return request({
        url: '/device/location/cameraTotal',
        method: 'get',
        params: query
    })
}

// 新增摄像头位置
export function getAreaCameraLocationList(query) {
    return request({
        url: '/device/location',
        method: 'get',
        params: query
    })
}

// 新增摄像头位置信息（批量）
export function saveLocation(data) {
    return request({
        url: '/device/location/save',
        method: 'post',
        data: data
    })
}

// 查询指定场区摄像头列表（未配置位置）
export function getCameraNotConfigList(query) {
    return request({
        url: '/device/location/cameraNotConfigured',
        method: 'get',
        params: query
    })
}

// 删除摄像头位置信息
export function delLocation(locationId) {
    return request({
        url: '/device/location/' + locationId,
        method: 'delete'
    })
}

// 新增摄像头位置信息（批量）
export function saveLocationList(data) {
    return request({
        url: '/device/location/saveLocation',
        method: 'post',
        data: data
    })
}