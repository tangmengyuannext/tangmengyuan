import request from '@/utils/request'

// 查询实时告警列表
export function getalarmreals(query) {
  return request({
    url: '/overview/fengji/alarm/list',
    method: 'get',
    params:query
  })
}
// 查询区域列表
export function geteventstendByarea(query) {
  return request({
    url: '/overview/fengji/events/tend',
    method: 'get',
    params:query
  })
}
export function getalarmtypesByarea(query) {
  return request({
    url: '/overview/fengji/alarm/types',
    method: 'get',
    params:query
  })
}
export function getdefectypesByarea(query) {
  return request({
    url: '/overview/fengji/defect/types',
    method: 'get',
    params:query
  })
}
export function getalarmlevelByarea(query) {
  return request({
    url: '/overview/fengji/alarm/level',
    method: 'get',
    params:query
  })
}
export function getdevicealarms(query) {
  return request({
    url: '/overview/fengji/device/alarm/top',
    method: 'get',
    params:query
  })
}
export function getdevicedefects(query) {
  return request({
    url: '/overview/fengji/device/defect/top',
    method: 'get',
    params:query
  })
}
export function getdefectdisposalByarea(query){
  return request({
    url: '/overview/fengji/defect/disposal',
    method: 'get',
    params:query
  })
}
export function geteventstemperatureByarea(query){
  return request({
    url: '/overview/fengji/events/temperature',
    method: 'get',
    params:query
  })
}