import request from '@/utils/request'

// 查询告警算法详细
export function getEquipment(query) {
    return request({
      url: '/device/equipmentDefect/list',
      method: 'get',
      params:query
    })
}