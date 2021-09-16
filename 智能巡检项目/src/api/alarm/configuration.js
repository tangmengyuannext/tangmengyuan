import request from '@/utils/request'

// 获取告警配置列表
export function listConfiguration(query) {
    return request({
        url: '/alarm/rule/list',
        method: 'get',
        params: query
    })
}

// 查询告警配置详细
export function getConfiguration(ruleId) {
    return request({
        url: '/alarm/rule/' + ruleId,
        method: 'get'
    })
}

// 新增告警配置
export function addConfiguration(data) {
    return request({
        url: '/alarm/rule',
        method: 'post',
        data: data
    })
}

// 修改告警配置
export function updateConfiguration(data) {
    return request({
        url: '/alarm/rule',
        method: 'put',
        data: data
    })
}

// 删除告警配置
export function delConfiguration(configurationId) {
    return request({
        url: '/alarm/rule/' + configurationId,
        method: 'delete'
    })
}

// 导出告警配置
export function exportConfiguration(query) {
    return request({
        url: '/alarm/rule/export',
        method: 'get',
        params: query
    })
}