import request from '@/utils/request'

// 查询实时告警列表
export function listPolpatrolItem(query) {
  return request({
    url: '/pol/item/list',
    method: 'get',
    params:query
  })
}
export function listAreaSites(query) {
  return request({
    url: '/device/site/list',
    method: 'get',
    params:query
  })
}
export function listSiteMeters(query) {
  return request({
    url: '/device/configMeter/list',
    method: 'get',
    params:query
  })
}
// 增加新的任务计划
export function addpatrolitem(data) {
  return request({
    url: '/pol/item',
    method: 'post',
    data:data
  })
}
export function delPatrolItem(itemId) {
  return request({
    url: '/pol/item/'+itemId,
    method: 'delete'
  })
}
export function updateItem(data) {
  return request({
    url: '/pol/item/',
    method: 'put',
    data:data
  })
}
export function getDetails(itemId){
  return request({
    url: '/pol/item/details/'+itemId,
    method: 'get'   
  })
}
export function validateUseStatus(itemId){
  return request({
    url: '/pol/item/valid/'+itemId,
    method: 'get'   
  })
}