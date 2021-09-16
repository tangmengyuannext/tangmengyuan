import request from '@/utils/request'

// 查询实时报警列表
export function listRealtime(query) {
    return request({
        url: '/alarm/real/list',
        method: 'get',
        params: query
    })
}

// 查询实时报警详细
export function getRealtime(realtimeId) {
  return request({
    url: '/alarm/real/' + realtimeId,
    method: 'get'
  })
}

// 处理告警
export function dispose(data) {
    return request({
        url: '/alarm/real/dispose',
        method: 'post',
        data: data
    })
}

// 导出告警详情实时列表
export function exportRealtime(query) {
  return request({
    url: '/alarm/real/export',
    method: 'get',
    params: query
  })
}
