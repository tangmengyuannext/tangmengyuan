import request from '@/utils/request'

export function getAlarmTypePie(query) {
  return request({
    url: '/overview/personsafety/getAlarmTypePie',
    method: 'get',
    params: query
  })
}

export function getDefectTypePie(query) {
  return request({
    url: '/overview/personsafety/getDefectTypePie',
    method: 'get',
    params: query
  })
}

export function getAlarmTendLine(query) {
  return request({
    url: '/overview/personsafety/getAlarmTendLine',
    method: 'get',
    params: query
  })
}

export function getTop10(query) {
  return request({
    url: '/overview/personsafety/getAlarmTop10',
    method: 'get',
    params: query
  })
}
