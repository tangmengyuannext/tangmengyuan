import request from '@/utils/request'

// 查询告警通知列表
export function listWarningnotice(query) {
    return request({
        url: '/alarm/inform/list',
        method: 'get',
        params: query
    })
}

// 查询告警通知
export function getWarningnotice(ruleId) {
    return request({
        url: '/alarm/inform/' + ruleId,
        method: 'get'
    })
}

// 新增告警通知
export function addWarningnotice(data) {
    return request({
        url: '/alarm/inform',
        method: 'post',
        data: data
    })
}

// 修改告警通知
export function updateWarningnotice(data) {
    return request({
        url: '/alarm/inform',
        method: 'put',
        data: data
    })
}

// 删除告警通知
export function delWarningnotice(configurationId) {
    return request({
        url: '/alarm/inform/' + configurationId,
        method: 'delete'
    })
}

// 导出告警通知
export function exportWarningnotice(query) {
    return request({
        url: '/alarm/inform/export',
        method: 'get',
        params: query
    })
}


///////////////////////////////////////////////////////////////////////////
// 查询告警通知详情列表
export function WarningnoticeDetaillist(query) {
    return request({
        url: '/alarm/informDetail/list',
        method: 'get',
        params: query
    })
}

// 查询告警通知详情
export function getWarningnoticeDetail(ruleId) {
    return request({
        url: '/alarm/informDetail/' + ruleId,
        method: 'get'
    })
}

// 新增告警通知详情
export function addWarningnoticeDetail(data) {
    return request({
        url: '/alarm/informDetail',
        method: 'post',
        data: data
    })
}

// 修改告警通知详情
export function updateWarningnoticeDetail(data) {
    return request({
        url: '/alarm/informDetail',
        method: 'put',
        data: data
    })
}

// 删除告警通知详情
export function delWarningnoticeDetail(configurationId) {
    return request({
        url: '/alarm/informDetail/' + configurationId,
        method: 'delete'
    })
}

// 导出告警通知详情
export function exportWarningnoticeDetail(query) {
    return request({
        url: '/alarm/informDetail/export',
        method: 'get',
        params: query
    })
}


////////////////////////////////////////////////////////////

// 获取广播列表
export function ListinformVoice(query) {
    return request({
        url: '/alarm/informVoice/list',
        method: 'get',
        params: query
    })
}

// 查询广播列表
export function getinformVoice(ruleId) {
    return request({
        url: '/alarm/informVoice/' + ruleId,
        method: 'get'
    })
}
