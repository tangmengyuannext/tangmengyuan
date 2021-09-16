import request from '@/utils/request'

// 查询数据字典列表
export function listDatadictionary(query) {
    return request({
        url: '/base/datadictionary/list',
        method: 'get',
        params: query
    })
}

// 查询数据字典详细
export function getDatadictionary(lineId) {
    return request({
        url: '/base/datadictionary/' + lineId,
        method: 'get'
    })
}

// 新增数据字典

export function addDatadictionary(data) {
    return request({
        url: '/base/datadictionary',
        method: 'post',
        data: data
    })
}

// 修改数据字典

export function updateDatadictionary(data) {
    return request({
        url: '/base/datadictionary',
        method: 'put',
        data: data
    })
}

// 删除数据字典

export function delDatadictionary(lineId) {
    return request({
        url: '/base/datadictionary/' + lineId,
        method: 'delete'
    })
}

// 导出数据字典

export function exportDatadictionary(query) {
    return request({
        url: '/base/datadictionary/export',
        method: 'get',
        params: query
    })
}