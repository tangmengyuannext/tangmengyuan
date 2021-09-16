import request from '@/utils/request'

// 查询照片对比列表
export function listFacepicture(query) {
    return request({
        url: '/faceRecognition/list',
        method: 'get',
        params: query
    })
}

// 查询照片对比详细
export function getFacepicture(faceId) {
    return request({
        url: '/faceRecognition/' + faceId,
        method: 'get'
    })
}

// 新增照片对比
export function addFacepicture(data) {
    return request({
        url: '/faceRecognition',
        method: 'post',
        data: data
    })
}

// 修改照片对比
export function updateFacepicture(data) {
    return request({
        url: '/faceRecognition',
        method: 'put',
        data: data
    })
}

// 删除照片对比
export function delFacepicture(faceId) {
    return request({
        url: '/faceRecognition/' + faceId,
        method: 'delete'
    })
}

// 导出人员信息
export function exportFacepicture(query) {
    return request({
        url: '/faceRecognition/export',
        method: 'get',
        params: query
    })
}
// 识别人员信息
export function recognitFacepicture(data) {
    return request({
        url: '/faceRecognition/recognits',
        method: 'post',
        data: data
    })
}
