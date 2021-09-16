import request from '@/utils/request'

// 查询实时告警列表
export function getalarmreals(query) {
  return request({
    url: '/overview/car/alarm/list',
    method: 'get',
    params:query
  })
}
export function getcaralarmtypes(query) {
  return request({
    url: '/overview/car/types',
    method: 'get',
    params:query
  })
}
export function getcaralarmtops(query) {
  return request({
    url: '/overview/car/alarm/top10',
    method: 'get',
    params:query
  })
}
export function getcaralarmsBytype(query) {
  return request({
    url: '/overview/car/alarm/type',
    method: 'get',
    params:query
  })
}
export function getcaralarmtend(query) {
  return request({
    url: '/overview/car/alarm/tend',
    method: 'get',
    params:query
  })
}
export function getcaralarmBydefecttype(query) {
  return request({
    url: '/overview/car/alarm/defect',
    method: 'get',
    params:query
  })
}
export function getcarenterandexitlist() {
  return request({
    url: '/overview/car/infos',
    method: 'get',
  })
}