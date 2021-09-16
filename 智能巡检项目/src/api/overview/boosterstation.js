import request from '@/utils/request'

export function getAlarmTypePie(query) {
  return request({
    url: '/overview/boosterstation/getAlarmTypePie',
    method: 'get',
    params: query
  })
}

export function getAlarmTendLine(query) {
  return request({
    url: '/overview/boosterstation/getAlarmTendLine',
    method: 'get',
    params: query
  })
}

export function getAlarmLevelPie(query) {
  return request({
    url: '/overview/boosterstation/getAlarmLevelPie',
    method: 'get',
    params: query
  })
}

export function getDefectTypePie(query) {
  return request({
    url: '/overview/boosterstation/getDefectTypePie',
    method: 'get',
    params: query
  })
}

export function getDefectTendLine(query) {
  return request({
    url: '/overview/boosterstation/getDefectTendLine',
    method: 'get',
    params: query
  })
}

export function getDisposeCategory(query) {
  return request({
    url: '/overview/boosterstation/getDisposeCategory',
    method: 'get',
    params: query
  })
}

export function getAlarmTop10(query) {
  return request({
    url: '/overview/boosterstation/getAlarmTop10',
    method: 'get',
    params: query
  })
}

export function getDefectTop10(query) {
  return request({
    url: '/overview/boosterstation/getDefectTop10',
    method: 'get',
    params: query
  })
}
