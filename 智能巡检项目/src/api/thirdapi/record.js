import request from '@/utils/request'

// 查询系统参数列表
export function listConfig(query) {
    return request({
        url: '/thirdApi/config/list',
        method: 'get',
        params: query
    })
}

// 查询系统参数信息详情
export function getConfig(configId) {
    return request({
        url: '/thirdApi/config/' + configId,
        method: 'get'
    })
}

// 修改系统参数信息
export function updateConfig(data) {
    return request({
        url: '/thirdApi/config/',
        method: 'put',
        data: data
    })
}

// 查询上传记录列表
export function listRecord(query) {
    return request({
        url: '/thirdApi/record/list',
        method: 'get',
        params: query
    })
}