import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}

//首页index
// 首页中风机、升压站缺陷数量
export function getfirstIndex(query) {
  return request({
    url: '/general/queryDefectByAreaType',
    method: 'get',
    params: query
  })
}

//首页index
// 首页中人员安全、机动车辆缺陷数量
export function getSecondIndex(query) {
  return request({
    url: '/general/queryDefectByDefectTypeSub',
    method: 'get',
    params: query
  })
}

//获取首页数量和百分比
export function getCountAndRate(query) {
  return request({
    url: '/general/getCountAndRate',
    method: 'get',
    params: query
  })
}

// 风机echarts  参数：areaType：风机,interval ：day/month
export function getfanEcharts(query) {
  return request({
    url: '/general/queryAlarmEventTemperature',
    method: 'get',
    params: query
  })
}

// 升压站echarts  参数：areaType：升压站, size： 5
export function getboosterstationEcharts(query) {
  return request({
    url: '/general/queryDefectByDefectTypeSub',
    method: 'get',
    params: query
  })
}

