import request from '@/utils/request'

// 查询巡检模板列表
export function listTemplate(query) {
  return request({
    url: '/patrol/template/selectPolRecordTemplateList',
    method: 'get',
    params:query
  })
}

// 查询巡检模板详情
export function getTemplate(templateId) {
  return request({
      url: '/patrol/template/' + templateId,
      method: 'get'
  })
}

// 新增巡检信息模板
export function addTemplate(data) {
  return request({
      url: '/patrol/template/',
      method: 'post',
      data: data
  })
}

// 修改巡检信息模板
export function updateTemplate(data) {
  return request({
      url: '/patrol/template/',
      method: 'put',
      data: data
  })
}

// 删除巡检信息模板
export function delTemplate(templateId) {
  return request({
      url: '/patrol/template/' + templateId,
      method: 'delete'
  })
}