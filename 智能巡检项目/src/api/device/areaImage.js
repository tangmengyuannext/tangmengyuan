import request from '@/utils/request'

// 查询图片标记列表
export function listAreaImage(query) {
    return request({
        url: '/device/areaImage/list',
        method: 'get',
        params: query
    })
}

// 查询图片标记详细
export function getAreaImage(imageId) {
    return request({
        url: '/device/areaImage/' + imageId,
        method: 'get'
    })
}

// 查询固定路径底图文件名
export function getAllImageName() {
    return request({
        url: '/device/areaImage/image/name',
        method: 'get'
    })
}

// 查询区域底图和摄像头列表
export function getAreaInfo(areaId) {
    return request({
        url: '/device/areaImage/area/' + areaId,
        method: 'get'
    })
}

// 新增图片标记
export function addAreaImage(data) {
    return request({
        url: '/device/areaImage',
        method: 'post',
        data: data
    })
}

// 修改图片标记
export function updateAreaImage(data) {
    return request({
        url: '/device/areaImage',
        method: 'put',
        data: data
    })
}

// 删除图片标记
export function delAreaImage(imageId) {
    return request({
        url: '/device/areaImage/' + imageId,
        method: 'delete'
    })
}

// 导出图片标记
export function exportAreaImage(query) {
    return request({
        url: '/device/areaImage/export',
        method: 'get',
        params: query
    })
}