import request from '@/utils/request'

// ---------------------配置表计-------------------------------//
// 获取配置表计列表
export function listMeterBase(query) {
    return request({
        url: '/device/meterBase/list',
        method: 'get',
        params: query
    })
}

// 查询配置表计详细
export function getMeterBase(meterId) {
    return request({
        url: '/device/meterBase/' + meterId,
        method: 'get'
    })
}

// 新增配置表计
export function addMeterBase(data) {
    return request({
        url: '/device/meterBase',
        method: 'post',
        data: data
    })
}

// 修改配置表计
export function updateMeterBase(data) {
    return request({
        url: '/device/meterBase',
        method: 'put',
        data: data
    })
}

// 删除配置表计
export function delMeterBase(meterIds) {
    return request({
        url: '/device/meterBase/' + meterIds,
        method: 'delete'
    })
}

// 导出配置表计
export function exportMeterBase(query) {
    return request({
        url: '/device/meterBase/export',
        method: 'get',
        params: query
    })
}
