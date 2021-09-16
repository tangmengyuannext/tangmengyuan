import request from '@/utils/request'

// 查询历史报警列表
export function listHistory(query) {
  return request({
    url: '/alarm/history/list',
    method: 'get',
    params: query
  })
}

// 查询历史报警详细
export function getHistory(historyId) {
  return request({
    url: '/alarm/history/' + historyId,
    method: 'get'
  })
}

// 导出历史报警
export function exportHistory(query) {
  return request({
    url: '/alarm/history/export',
    method: 'get',
    params: query
  })
}

// // 修改历史报警
// export function updateHistory(data) {
//     return request({
//         url: '/alarm/history',
//         method: 'put',
//         data: data
//     })
// }

// // 删除历史报警
// export function delHistory(historyId) {
//     return request({
//         url: '/alarm/history/' + historyId,
//         method: 'delete'
//     })
// }
