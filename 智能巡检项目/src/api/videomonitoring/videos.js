import request from '@/utils/request'

// 查询预置位列表
export function listVideomonitoring(query) {
    return request({
        url: '/device/site/list',
        method: 'get',
        params: query
    })
}

// 查询预置位详细
export function getVideomonitoring(ruleId) {
    return request({
        url: '/device/site/' + ruleId,
        method: 'get'
    })
}

// 新增预置位
export function addVideomonitoring(data) {
    return request({
        url: '/device/site',
        method: 'post',
        data: data
    })
}

// 修改预置位
export function updateVideomonitoring(data) {
    return request({
        url: '/device/site',
        method: 'put',
        data: data
    })
}

// 删除预置位
export function delVideomonitoring(configurationId) {
    return request({
        url: '/device/site/' + configurationId,
        method: 'delete'
    })
}

// 导出预置位
export function exportVideomonitoring(query) {
    return request({
        url: '/device/site/export',
        method: 'get',
        params: query
    })
}


//---------------------配置算法-------------------------------//

// configEquipment
// 新增配置算法
export function addconfigEquipment(data) {
    return request({
        url: '/device/configEquipment',
        method: 'post',
        data: data
    })
}

// 查询关联详细
export function getconfigEquipment(query) {
    return request({
        url: '/device/configEquipment/list',
        method: 'get',
        params: query
    })
}

// 修改配置算法
export function updateconfigEquipment(data) {
    return request({ 
        url: '/device/configEquipment',
        method: 'put',
        data: data
    })
}



//---------------------配置采集时间-------------------------------//

// 获取配置采集时间列表
export function listTimeconfig(query) {
    return request({
        url: '/device/configTime/list',
        method: 'get',
        params: query
    })
}

// 查询配置采集时间详细
export function getTimeconfig(TimeId) {
    return request({
        url: '/device/configTime/' + TimeId,
        method: 'get'
    })
}

// 新增配置采集时间
export function addTimeconfig(data) {
    return request({
        url: '/device/configTime',
        method: 'post',
        data: data
    })
}

// 修改配置采集时间
export function updateTimeconfig(data) {
    return request({
        url: '/device/configTime',
        method: 'put',
        data: data
    })
}

// 删除配置采集时间
export function delTimeconfig(TimeIds) {
    return request({
        url: '/device/configTime/' + TimeIds,
        method: 'delete'
    })
}

//-----------------------配置检测点-----------------------------------//
// 获取配置读数列表
export function listDetection(query) {
    return request({
        url: '/device/configDetection/list',
        method: 'get',
        params: query
    })
}

// 查询配置读数详细
export function getDetection(detectionId) {
    return request({
        url: '/device/configDetection/' + detectionId,
        method: 'get'
    })
}

// 新增配置读数
export function addDetection(data) {
    return request({
        url: '/device/configDetection',
        method: 'post',
        data: data
    })
}

// 修改配置读数
export function updateDetection(data) {
    return request({
        url: '/device/configDetection',
        method: 'put',
        data: data
    })
}

// 删除配置读数
export function delDetection(detectionIds) {
    return request({
        url: '/device/configDetection/' + detectionIds,
        method: 'delete'
    })
}

// 导出配置读数
export function exportDetection(query) {
    return request({
        url: '/device/configDetection/export',
        method: 'get',
        params: query
    })
}


// ---------------------配置表计-------------------------------//
// 获取配置表计列表
export function listMeterConfig(query) {
    return request({
        url: '/device/configMeter/list',
        method: 'get',
        params: query
    })
}

// 查询配置表计详细
export function getMeterConfig(meterId) {
    return request({
        url: '/device/configMeter/' + meterId,
        method: 'get'
    })
}

// 新增配置表计
export function addMeterConfig(data) {
    return request({
        url: '/device/configMeter',
        method: 'post',
        data: data
    })
}

// 修改配置表计
export function updateMeterConfig(data) {
    return request({
        url: '/device/configMeter',
        method: 'put',
        data: data
    })
}

// 删除配置表计
export function delMeterConfig(meterIds) {
    return request({
        url: '/device/configMeter/' + meterIds,
        method: 'delete'
    })
}

// 导出配置表计
export function exportMeterConfig(query) {
    return request({
        url: '/device/configMeter/export',
        method: 'get',
        params: query
    })
}

//--------------------------删除标注图片url--------------------------------//
export function delbiaozhuimgurl(data) {
    return request({
        url: '/system/meter/deleteImageData',
        method: 'post',
        data: data
    })
}

//---------------------读数项配置--------------------------------------//
// 获取配置读数项列表
export function listReading(query) {
    return request({
        url: '/device/configReading/list',
        method: 'get',
        params: query
    })
}

// 查询配置读数项详细
export function getReading(readingId) {
    return request({
        url: '/device/configReading/' + readingId,
        method: 'get'
    })
}

// 新增配置读数项
export function addReading(data) {
    return request({
        url: '/device/configReading',
        method: 'post',
        data: data
    })
}

// 修改配置读数项
export function updateReading(data) {
    return request({
        url: '/device/configReading',
        method: 'put',
        data: data
    })
}

// 删除配置读数项
export function delReading(readingIds) {
    return request({
        url: '/device/configReading/' + readingIds,
        method: 'delete'
    })
}


//----------------------------机器人配置预置位-----------------------------------------

// 查询机器人预置位列表
export function listRobotSite(query) {
    return request({
        url: '/device/robotSite/list',
        method: 'get',
        params: query
    })
}
// 查询机器人预置位列表
export function listRobotSiteVoById(robotId) {
    return request({
        url: '/device/robotSite/listsites/'+robotId,
        method: 'get',
    })
}
// 查询机器人预置位详情
export function getRobotSite(id) {
    return request({
        url: '/device/robotSite/' + id,
        method: 'get'
    })
}

// 新增机器人预置位
export function addRobotSite(data) {
    return request({
        url: '/device/robotSite',
        method: 'post',
        data: data
    })
}

// 修改机器人预置位
export function updateRobotSite(data) {
    return request({
        url: '/device/robotSite',
        method: 'put',
        data: data
    })
}

// 删除机器人预置位
export function delRobotSite(id) {
    return request({
        url: '/device/robotSite/' + id,
        method: 'delete'
    })
}