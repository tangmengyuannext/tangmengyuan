import request from '@/utils/request'

// 查询车辆信息列表
export function listCarInfo(query) {
    return request({
        url: '/car/info/list',
        method: 'get',
        params: query
    })
}

// 查询车辆信息详情
export function getCarInfo(carId) {
    return request({
        url: '/car/info/' + carId,
        method: 'get'
    })
}

// 新增车辆信息
export function addCarInfo(data) {
    return request({
        url: '/car/info',
        method: 'post',
        data: data
    })
}

// 修改车辆信息
export function updateCarInfo(data) {
    return request({
        url: '/car/info',
        method: 'put',
        data: data
    })
}

// 删除车辆信息
export function delCarInfo(carId) {
    return request({
        url: '/car/info/' + carId,
        method: 'delete'
    })
}

// 导出车辆信息
export function exportCarInfo(query) {
    return request({
        url: '/car/info/export',
        method: 'get',
        params: query
    })
}


