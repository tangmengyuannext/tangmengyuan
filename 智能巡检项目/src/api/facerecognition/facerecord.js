import request from '@/utils/request'

// 查询人员识别记录列表
export function listFaceRecord(query) {
    return request({
        url: '/faceRecognizeRecord/list',
        method: 'get',
        params: query
    })
}

// 查询人员识别记录详情
export function getFaceRecord(recordId) {
    return request({
        url: '/faceRecognizeRecord/' + recordId,
        method: 'get'
    })
}

// 删除人员识别记录
export function delFaceRecord(recordId) {
    return request({
        url: '/faceRecognizeRecord/' + recordId,
        method: 'delete'
    })
}


