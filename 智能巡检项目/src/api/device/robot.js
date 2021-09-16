import request from '@/utils/request'

// 查询机器人列表
export function listRobot(query) {
    return request({
        url: '/device/robot/list',
        method: 'get',
        params: query
    })
}

// 查询机器人详情
export function getRobot(robotId) {
    return request({
        url: '/device/robot/' + robotId,
        method: 'get'
    })
}

// 新增机器人
export function addRobot(data) {
    return request({
        url: '/device/robot',
        method: 'post',
        data: data
    })
}

// 修改机器人
export function updateRobot(data) {
    return request({
        url: '/device/robot',
        method: 'put',
        data: data
    })
}

// 删除机器人
export function delRobot(robotId) {
    return request({
        url: '/device/robot/' + robotId,
        method: 'delete'
    })
}


