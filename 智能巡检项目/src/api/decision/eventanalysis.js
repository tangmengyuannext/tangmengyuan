import request from '@/utils/request'

// 查询区域列表
export function listArea(query) {
  return request({
    url: '/device/area/list',
    method: 'get',
    params: query
  })
}
