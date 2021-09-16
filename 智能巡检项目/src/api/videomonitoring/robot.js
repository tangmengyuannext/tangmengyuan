import request from '@/utils/request'

// 查询机器人巡检计划列表
export function listpollingplan(query) {
    return request({
        url: '/pol/item/list',
        method: 'get',
        params: query
    })
}
// 查询机器人如果自动任务关的时候
	// 根据robotId判断是否有正在进行中的任务；
    // 如果有就提示有任务正在运行不能关闭，
    // 如果没有就直接关闭；
export function getautostatus(robotId) {
    return request({
        url: '/oneclick/inspection/execStatus/'+robotId,
        method: 'get',
    })
}
// 查询 自动任务开启时查看最近的一次执行的时间
export function getlasttime(robotId) {
    return request({
        url: '/oneclick/inspection/getCurExecTime/'+robotId,
        method: 'get',
    })
}

// 点击一键巡检跳转时
export function getinspectionStart(query) {
    return request({
        url: '/oneclick/inspection/start',
        method: 'get',
        params: query
    })
}

// 查询巡检结果
export function getinspectionInfo(query) {
    return request({
        url: '/oneclick/inspection/info',
        method: 'get',
        params: query
    })
}

// 查看结果
export function getmeterInfo(query) {
    return request({
        url: '/oneclick/inspection/meter/info',
        method: 'get',
        params: query
    })
}