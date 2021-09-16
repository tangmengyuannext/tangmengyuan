import request from '@/utils/request'

// 查询预置位列表
export function listSite(query) {
    return request({
        url: '/device/site/list',
        method: 'get',
        params: query
    })
}

// 查询预置位详细
export function getSite(siteId) {
    return request({
        url: '/device/site/' + siteId,
        method: 'get'
    })
}

// 新增预置位
export function addSite(data) {
    return request({
        url: '/device/site',
        method: 'post',
        data: data
    })
}

// 修改预置位
export function updateSite(data) {
    return request({
        url: '/device/site',
        method: 'put',
        data: data
    })
}

// 删除预置位
export function delSite(siteId) {
    return request({
        url: '/device/site/' + siteId,
        method: 'delete'
    })
}

// 导出预置位
export function exportSite(query) {
    return request({
        url: '/device/site/export',
        method: 'get',
        params: query
    })
}

// 导出预置位
export function listSiteTree(query) {
    return request({
        url: '/alarm/rule/getSiteTree',
        method: 'get',
        params: query
    })
}

// 下载用户导入模板
export function importTemplateSite() {
    return request({
        url: '/device/site/importTemplate',
        method: 'get'
    })
}