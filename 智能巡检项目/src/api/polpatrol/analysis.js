import request from '@/utils/request'

// 查询实时告警列表
export function listPolpatrol(query) {
  return request({
    url: '/pol/patrol/list',
    method: 'get',
    params:query
  })
}
// 增加新的任务计划
export function addpatrol(data) {
  return request({
    url: '/pol/patrol',
    method: 'post',
    data:data
  })
}
export function validPatrol(patrolIds){
  return request({
    url: '/pol/patrol/valid/'+patrolIds,
    method: 'get'
  })
}
export function delPatrol(patrolIds){
  return request({
    url: '/pol/patrol/'+ patrolIds,
    method: 'delete'
  })
}
// 根据Id获取任务计划详情
export function getPatrol(patrolId) {
  return request({
    url: '/pol/patrol/'+patrolId,
    method: 'get'
  })
}
// 移除任务
export function startPotrol(data) {
  return request({
    url: '/pol/patrol/start',
    method: 'post',
    data:data
  })
}
// 移除任务
export function stopPotrol(data) {
  return request({
    url: '/pol/patrol/stop',
    method: 'post',
    data:data
  })
}
// 根据Id获取任务计划详情
export function updatePatrol(data) {
  return request({
    url: '/pol/patrol/',
    method: 'put',
    data:data
  })
}