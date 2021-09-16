import request from '@/utils/request'

// 获取广播列表
export function ListinformVoice(query) {
    return request({
        url: '/alarm/informVoice/list',
        method: 'get',
        params: query
    })
}

// 新增广播列表
export function addinformVoice(data) {
    return request({
        url: '/alarm/informVoice',
        method: 'post',
        data: data
    })
}

// 删除广播列表
export function delinformVoice(voiceId) {
    return request({
        url: '/alarm/informVoice/' + voiceId,
        method: 'delete'
    })
}