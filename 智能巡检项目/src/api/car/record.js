import request from '@/utils/request'

// 查询车辆记录列表
export function listCarRecord(query) {
    return request({
        url: '/car/record/list',
        method: 'get',
        params: query
    })
}

// 查询车辆记录详情
export function getCarRecord(recordId) {
    return request({
        url: '/car/record/' + recordId,
        method: 'get'
    })
}

// 删除车辆记录信息
export function delCarRecord(recordId) {
    return request({
        url: '/car/record/' + recordId,
        method: 'delete'
    })
}

// 导出车辆记录信息
export function exportCarRecord(query) {
    return request({
        url: '/car/record/export',
        method: 'get',
        params: query
    })
}


