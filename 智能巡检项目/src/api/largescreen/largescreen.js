import request from '@/utils/request'

/**最新10条实时告警信息 */
export function getLatestAlarmData(areaId) {
    return request({
        url: '/largescreen/alarm/list',
        method: 'get',
        params: areaId
    })
}

/**获取实时告警趋势折线图(30日) */
export function getRealTimeAlarmTrend(areaId) {
    return request({
        url: '/largescreen/alarm/tend',
        method: 'get',
        params: areaId
    })
}

/**获取告警类型前五扇形图 */
export function getTopFiveAlarmType(areaId) {
    return request({
        url: '/largescreen/alarm/types',
        method: 'get',
        params: areaId
    })
}

/**获取最新10条缺陷信息 */
export function getLatestDefectData(areaId) {
    return request({
        url: '/largescreen/defect/list',
        method: 'get',
        params: areaId
    })
}

/**获取缺陷趋势折线图(30日) */
export function getDefectTrend(areaId) {
    return request({
        url: '/largescreen/defect/tend',
        method: 'get',
        params: areaId
    })
}

/**获取缺陷类型前五扇形图 */
export function getTopFiveDefectType(areaId) {
    return request({
        url: '/largescreen/defect/types',
        method: 'get',
        params: areaId
    })
}

/**根据摄像头Id获取24小时温度 */
export function getTempLineByEquipment(cameraParam) {
    return request({
        url: '/largescreen/temp/24?cameraIds=' + cameraParam.cameraIds,
        method: 'get',
    })
}

/**根据areaType获取区域下(包括子区域)的温度摄像头信息 */
export function getTempCameraList(query) {
    return request({
        url: '/largescreen/temp/camera',
        method: 'get',
        params: query
    })
}

/**获取当天巡检计划 */
export function getCurrentDayPatrol() {
    return request({
        url: '/largescreen/patrol/day',
        method: 'get',
    })
}

/**获取本周巡检问题数量统计 */
export function getPatrolError() {
    return request({
        url: '/largescreen/patrol/error',
        method: 'get',
    })
}

/**获取本周巡检计划和完成情况 */
export function getPatrolProgress() {
    return request({
        url: '/largescreen/patrol/week',
        method: 'get',
    })
}

/**保存地图坐标 */
export function saveLocation(data) {
    return request({
        url: '/device/location/saveLargeScreen',
        method: 'post',
        data: data
    })
}

/**获取指定区域设备全部智能感知设备列表 */
export function getLocationCamera(param) {
    return request({
        url: '/device/location/cameraList?areaId=' + param,
        method: 'get',
        // param: param
    })
}

/**获取大屏摄像头默认选项 */
export function getCameraDefaultSetting() {
    return request({
        url: '/largescreen/getCameraSelectionDefault',
        method: 'get',
    })
}

/**保存大屏摄像头默认选项 */
export function saveCameraDefaultSetting(param) {
    return request({
        url: '/largescreen/saveCameraSelectionDefault',
        method: 'post',
        data: param
    })
}

/**查询指定区域设备摄像头位置信息 */
export function getLocationByArea(param) {
    return request({
        url: '/device/location',
        method: 'get',
        params: param
    })
}

/**删除摄像头位置信息 */
export function deleteCameraLoction(param) {
    return request({
        url: '/device/location/' + param,
        method: 'delete',
        // params: param
    })
}

/**查询指定场区摄像头列表（未配置位置） */
export function cameraNotConfigured(param) {
    return request({
        url: '/device/location/cameraNotConfigured?areaId=' + param,
        method: 'get',
        // params: param
    })
}