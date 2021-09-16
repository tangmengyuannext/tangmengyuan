import request from '@/utils/request'

// 查询实时告警列表
export function listPatrolrecord(query) {
  return request({
    url: '/pol/record/list',
    method: 'get',
    params:query
  })
}
// 查询巡检报告信息
export function getViewReport(id) {
  return request({
    url: '/pol/record/report/'+id,
    method: 'get'
  })
}
// 查询巡检报告信息
export function downloadReport(id) {
  return request({
    url: '/pol/record/download/'+id,
    method: 'get',
    responseType: 'blob'
  })
}

// 查询巡检详情信息
export function recordDetailMsg(recordId) {
  return request({
    url: '/pol/record/view/'+recordId,
    method: 'get',
  })
}
export function delPatrolRecord(recordIds){
  return request({
    url: '/pol/record/'+ recordIds,
    method: 'delete'
  })
}