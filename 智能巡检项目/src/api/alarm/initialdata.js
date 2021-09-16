import request from '@/utils/request'

// 查询原始数据列表
export function listInitialdata(query) {
    return request({
        url: '/alarm/event/list',
        method: 'get',
        params: query
    })
}

// 查询原始数据详细
export function getInitialdata(historyId) {
    return request({
        url: '/alarm/event/' + historyId,
        method: 'get'
    })
}

