import request from '@/utils/request'

// 统计风机列表接口
export function listFan(query) {
    return request({
        url: '/survey/fan/list', //  /general/fan/list
        method: 'get',
        params: query
    })
}

//当日告警查询列表接口
export function listAlarm(query) {
    return request({
        url: '/survey/fan/alarm',
        method: 'get',
        params: query
    })
}

// // 查询风机实时温度
export function getFantemp(areaId) {
    return request({
        url: '/general/fan/temp/' + areaId,
        method: 'get'
    })
}

// // 统计风机24小时温度
export function getFantemp24(query) {
    return request({
        url: '/survey/fan/temp48',
        method: 'get',
        params: query
    })
}

// // 统计风机产生缺陷数量排名
export function getFandefect(areaId) {
    return request({
        url: '/general/fan/defect/' + areaId,
        method: 'get'
    })
}

// // 修改风机
// export function updateFan(data) {
//     return request({
//         url: '/survey/fan',
//         method: 'put',
//         data: data
//     })
// }

// // 删除风机
// export function delFan(fanId) {
//     return request({
//         url: '/survey/fan/' + fanId,
//         method: 'delete'
//     })
// }

// // 导出风机
// export function exportFan(query) {
//     return request({
//         url: '/survey/fan/export',
//         method: 'get',
//         params: query
//     })
// }