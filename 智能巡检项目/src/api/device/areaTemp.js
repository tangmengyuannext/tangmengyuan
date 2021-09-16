import request from '@/utils/request'

// 查询区域温度列表
export function listAreaTemp(query) {
    return request({
        url: '/device/areaTemp/list',
        method: 'get',
        params: query
    })
}

// 查询区域温度详细
export function getAreaTemp(id) {
    return request({
        url: '/device/areaTemp/' + id,
        method: 'get'
    })
}

// 新增区域温度
export function addAreaTemp(data) {
    return request({
        url: '/device/areaTemp',
        method: 'post',
        data: data
    })
}

// 修改区域温度
export function updateAreaTemp(data) {
    return request({
        url: '/device/areaTemp',
        method: 'put',
        data: data
    })
}

// 删除区域温度
export function delAreaTemp(id) {
    return request({
        url: '/device/areaTemp/' + id,
        method: 'delete'
    })
}

// 导出区域温度
export function exportAreaTemp(query) {
    return request({
        url: '/device/areaTemp/export',
        method: 'get',
        params: query
    })
}