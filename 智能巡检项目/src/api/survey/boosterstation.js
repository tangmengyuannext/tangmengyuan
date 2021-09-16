import request from '@/utils/request'

// 查询升压站缺陷饼状图信息
export function getBoosterStationAlarm(areaId) {
    return request({
        url: '/survey/booster/alarm/'+areaId,
        method: 'get'
    })
}
// 查询升压站测温摄像头列表
export function getCameraList(areaId) {
  return request({
    url: '/survey/booster/tempCamera/'+areaId,
    method: 'get'
  })
}
// 查询实时温度折线图数据
export function getDeviceTemp(cameraParam) {
  return request({
    url: '/survey/booster/temp48?cameraIds=' + cameraParam.cameraIds,
    method: 'get'
  })
}
// 查最高温度数据
export function getHighestTemp(cameraParam) {
  return request({
    url: '/survey/booster/maxTemp?cameraIds=' + cameraParam.cameraIds,
    method: 'get'
  })
}

export function listRealtime(query) {
  return request({
    url: '/survey/booster/realAlarm/list',
    method: 'get',
    params: query
  })
}
// 保存设备列表选项
export function saveSelectionDefault(data) {
    return request({
        url: '/survey/booster/saveSelectionDefault',
        method: 'post',
        data: data
    })
}

// 查询设备列表默认选项
export function getSelectionDefault() {
    return request({
        url: '/survey/booster/getSelectionDefault',
        method: 'get'
    })
}

// // 删除升压站
// export function delBoosterstation(configurationId) {
//     return request({
//         url: '/survey/boosterstation/' + configurationId,
//         method: 'delete'
//     })
// }

// // 导出升压站
// export function exportBoosterstation(query) {
//     return request({
//         url: '/survey/boosterstation/export',
//         method: 'get',
//         params: query
//     })
// }
