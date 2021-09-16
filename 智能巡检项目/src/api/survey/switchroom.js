import request from '@/utils/request'

// 查询配电室列表
export function listSwitchRoom() {
    return request({
        url: '/survey/switchroom/list',
        method: 'get'
    })
}

// 查询升压站测温摄像头列表
export function getCameraList(areaId) {
    return request({
      url: '/survey/switchroom/tempCamera/'+areaId,
      method: 'get'
    })
  }
  // 查询实时温度折线图数据
  export function getDeviceTemp(cameraParam) {
    return request({
      url: '/survey/switchroom/temp48?cameraIds=' + cameraParam.cameraIds,
      method: 'get'
    })
  }

// 保存设备列表选项
export function saveSelectionDefault(data) {
  return request({
    url: '/survey/switchroom/saveSelectionDefault',
    method: 'post',
    data: data
  })
}

// 查询设备列表默认选项
export function getSelectionDefault(areaId) {
  return request({
    url: '/survey/switchroom/getSelectionDefault?areaId='+areaId,
    method: 'get'
  })
}

// // 修改配电室
// export function updateSwitchroom(data) {
//     return request({
//         url: '/survey/switchroom',
//         method: 'put',
//         data: data
//     })
// }

// // 删除配电室
// export function delSwitchroom(switchroomId) {
//     return request({
//         url: '/survey/switchroom/' + switchroomId,
//         method: 'delete'
//     })
// }

// // 导出配电室
// export function exportSwitchroom(query) {
//     return request({
//         url: '/survey/switchroom/export',
//         method: 'get',
//         params: query
//     })
// }
