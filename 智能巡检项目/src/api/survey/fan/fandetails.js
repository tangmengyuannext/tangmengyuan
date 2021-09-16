import request from '@/utils/request'

// // 删除  ==> 批量处理之后数据到历史告警中；
export function getDealwith(data) {
    return request({
        url: '/alarm/history/batchDispose',
        method: 'post',
        data: data
    })
}


// 确认  批量确认
export function getConfirms(alarmDetailIds) {
    return request({
        url: '/alarm/real/confirm/' + alarmDetailIds,
        method: 'get'
    })
}
