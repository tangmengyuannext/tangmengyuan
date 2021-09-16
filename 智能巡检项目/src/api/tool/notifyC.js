/**
 * 通知C端程序
 *
 * @author Wade
 * @date 2021-09-08
 */
import request from '@/utils/request'

export function selectDevNotifyCList(query) {
  return request({
    url: '/device/notifyC/selectDevNotifyCList',
    method: 'get',
    params: query
  })
}

export function insertDevNotifyC(query) {
  return request({
    url: '/device/notifyC/insertDevNotifyC',
    method: 'post',
    data: query
  })
}
