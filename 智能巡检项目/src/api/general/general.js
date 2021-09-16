import request from '@/utils/request'
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme

// 查询某区域当日实时告警总数
export function todayAlarm(query) {
  return request({
    url: '/general/today/alarm',
    method: 'get',
    params: query
  })
}

// 查询某区域当日原始事件总数
export function todayEvent(query) {
  return request({
    url: '/general/today/event',
    method: 'get',
    params: query
  })
}

// 查询某区域近 30 天原始事件总数
export function day30Event(query) {
  return request({
    url: '/general/day30/event',
    method: 'get',
    params: query
  })
}

// 查询某区域近 30 天告警总数
export function day30Alarm(query) {
  return request({
    url: '/general/day30/alarm',
    method: 'get',
    params: query
  })
}

export function loadPie(divId, pieData) {
  if (noData(divId, pieData.data)) return
  let myChart = echarts.init(document.getElementById(divId), 'macarons')
  myChart.setOption({
    legend: {
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: pieData.legendData
    },
    series: [
      {
        type: 'pie',
        radius: '45%',
        center: ['40%', '50%'],
        label: {
          formatter: ' {b}\n{d}% ',
          rich: {
            b: {
              fontSize: 16,
              lineHeight: 33
            }
          }
        },
        data: pieData.data
      }
    ]
  })
}

export function loadLine(divId, lineData) {
  let myChart = echarts.init(document.getElementById(divId), 'macarons')
  myChart.setOption({
    legend: {
      x: 'center',
      y: 'top',
      data: lineData.legendData
    },
    xAxis: {
      data: lineData.xAxisData,
      boundaryGap: false,
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    series: lineData.expectedData
  })
}

export function loadCategory(divId, categoryData) {
  let myChart = echarts.init(document.getElementById(divId), 'macarons')
  myChart.setOption({
    xAxis: {
      type: 'category',
      data: categoryData.xData
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: categoryData.yData,
      type: 'bar'
    }]
  })
}

function noData(divId, data) {
  if (data.length == 0) {
    let elementById = document.getElementById(divId)
    elementById.innerHTML = '暂无数据'
    return true
  }
  return false
}
