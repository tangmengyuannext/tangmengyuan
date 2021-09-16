import request from '@/utils/request'

// 查询数据管理列表
export function listDatamanagement(query) {
    return request({
        url: '/base/datamanagement/list',
        method: 'get',
        params: query
    })
}

// 查询数据管理详细
export function getDatamanagement(lineId) {
    return request({
        url: '/base/datamanagement/' + lineId,
        method: 'get'
    })
}

// 新增数据管理

export function addDatamanagement(data) {
    return request({
        url: '/base/datamanagement',
        method: 'post',
        data: data
    })
}

// 修改数据管理

export function updateDatamanagement(data) {
    return request({
        url: '/base/datamanagement',
        method: 'put',
        data: data
    })
}

// 删除数据管理

export function delDatamanagement(lineId) {
    return request({
        url: '/base/datamanagement/' + lineId,
        method: 'delete'
    })
}

// 导出数据管理

export function exportDatamanagement(query) {
    return request({
        url: '/base/datamanagement/export',
        method: 'get',
        params: query
    })
}