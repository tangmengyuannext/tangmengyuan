/**
 * 首页/概览
 *
 * @author Wade
 * @date 2021-06-21
 */
require('echarts/theme/macarons') // echarts theme
import echarts from 'echarts'
import request from '@/utils/request'

export function getCounts(query) {
  return request({
    url: '/overview/getCounts',
    method: 'get',
    params: query
  })
}

export function getAlarmRealList(query) {
  return request({
    url: '/overview/getAlarmRealList',
    method: 'get',
    params: query
  })
}

// 获取不分页的实时告警列表
export function getAllAlarmList(query) {
  return request({
    url: '/overview/getAlarmList',
    method: 'get',
    params: query
  })
}

export function getAreas(query) {
  return request({
    url: '/overview/getAreas',
    method: 'get',
    params: query
  })
}

export function getTemperLine(query) {
  return request({
    url: '/overview/getTemperLine',
    method: 'get',
    params: query
  })
}

export function getTemperLineIndex(query) {
  return request({
    url: '/overview/getTemperLineIndex',
    method: 'get',
    params: query
  })
}

export function getAreaTempOptions(query) {
  return request({
    url: '/overview/getAreaTempOptions',
    method: 'get',
    params: query
  })
}

export function getSelectOptions(query) {
  return request({
    url: '/overview/getSelectAreaTempOptions',
    method: 'get',
    params: query
  })
}

export function putSelectOptions(query) {
  return request({
    url: '/overview/putSelectAreaTempOptions',
    method: 'put',
    data: query
  })
}

export function getAlarmTendLine(query) {
  return request({
    url: '/overview/getAlarmTendLine',
    method: 'get',
    params: query
  })
}

export function getDefectTendLine(query) {
  return request({
    url: '/overview/getDefectTendLine',
    method: 'get',
    params: query
  })
}

export function getAlarmCategory(query) {
  return request({
    url: '/overview/getAlarmCategory',
    method: 'get',
    params: query
  })
}

export function getDefectCategory(query) {
  return request({
    url: '/overview/getDefectCategory',
    method: 'get',
    params: query
  })
}

export function getTemperCategory(query) {
  return request({
    url: '/overview/getTemperCategory',
    method: 'get',
    params: query
  })
}

export function getAlarmTypePie(query) {
  return request({
    url: '/overview/getAlarmTypePie',
    method: 'get',
    params: query
  })
}

export function getDefectTypePie(query) {
  return request({
    url: '/overview/getDefectTypePie',
    method: 'get',
    params: query
  })
}

export function getCarList(query) {
  return request({
    url: '/overview/getCarList',
    method: 'get',
    params: query
  })
}

export function getCarCounts(query) {
  return request({
    url: '/overview/getCarCounts',
    method: 'get',
    params: query
  })
}

export function loadPie(divId, pieData) {
  let myChart = echarts.init(document.getElementById(divId), 'macarons')
  let option = {
    title: {
      x: 'center',
      y: 'center',
      textStyle: {
        color: '#909399',
        fontSize: 14
      }
    },
    color: ['#1890FF', '#51B6FF', '#FFDC51', '#78CDD1', '#2657FF', '#0babbe', '#34f0e0', '#7575f5', '#0ECEFF', '#6affec'],
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
          formatter: ' {b}\n{c} ({d}%) ',
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
  }
  if (pieData.legendData.length == 0) {
    option.title.text = '暂无数据'
  } else {
    option.title.text = ''
  }
  myChart.setOption(option)
}

export function loadLine(divId, lineData) {
  let myChart = echarts.init(document.getElementById(divId), 'macarons')
  let colors = ['#1890FF', '#51B6FF', '#FFDC51', '#78CDD1', '#2657FF', '#0babbe', '#34f0e0', '#7575f5', '#0ECEFF', '#6affec']
  let option = {
    title: {
      x: 'center',
      y: 'center',
      textStyle: {
        color: '#909399',
        fontSize: 14
      }
    },
    color: colors,
    legend: {
      x: 'center',
      y: 'top',
      type: 'scroll',
      padding: 5,
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
      left: '3%',
      right: '4%',
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      // axisPointer: {
      //   type: 'cross'
      // },
      confine: true,
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      },
      minInterval: 1
    },
    series: lineData.expectedData
  }
  noData(lineData.legendData, option)
  myChart.setOption(option, true)
}

export function loadCategory(divId, categoryData) {
  let myChart = echarts.init(document.getElementById(divId), 'macarons')
  let colors = ['#6affec', '#0ECEFF', '#7575f5', '#34f0e0', '#0babbe', '#2657FF', '#78CDD1', '#FFDC51', '#51B6FF', '#1890FF'];
  let option = {
    title: {
      x: 'center',
      y: 'center',
      textStyle: {
        color: '#909399',
        fontSize: 14
      }
    },
    grid: {
      left: 0,
      right: '4%',
      bottom: '6%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      minInterval: 1
    },
    yAxis: {
      type: 'category',
      data: categoryData.yData,
      axisLabel: {
        formatter: function(value) {
          if (value.length > 6) {
            value = value.slice(0,6) + '...';
          }
          return value;
        }
      },
    },
    tooltip: {
      formatter: function (params, ticket, callback) {
        // console.log(params)
        let html = '';
        if (params.name) {
          html += params.name + ': ' + params.data + '个';
        } else {
          html += '0';
        }
        return html;
      }
    },
    series: [{
      data: categoryData.xData,
      type: 'bar',
      itemStyle: {
        color: function (param) {
          return colors[param.dataIndex] || colors[0];
        }
      },
    }]
  }
  noData(categoryData.yData, option)
  myChart.setOption(option)
}

export function noData(data, option) {
  if (data.length == 0) {
    option.title.text = '暂无数据'
  } else {
    option.title.text = ''
  }
}

export function getIndex(val, arr) {
  for (const i in arr) {
    if (arr[i] == val) return i
  }
  return false
}

export function distinctPush(val, arr) {
  for (const i in arr) {
    if (val == arr[i]) return
  }
  arr.push(val)
}

export function distinctStrPush(val, arr) {
  for (const i in arr) {
    let valStr = JSON.stringify(val)
    let iStr = JSON.stringify(arr[i])
    if (valStr == iStr) return
  }
  arr.push(val)
}

export function handleLineData(data) {
  let lineData = {}
  let legendData = []
  let xAxisData = []
  let expectedData = []
  let temp = ''
  let obj = {}
  let dataArr = []
  let lData = ''
  let tempArr = []
  for (let i = 0; i < data.length; i++) { // 获取横坐标和legend
    if (!legendData.includes(data[i].lData)) {
      legendData.push(data[i].lData)
      tempArr.push({
        name: data[i].lData,
        xData: [],
        yData: []
      })
      expectedData.push({
        name: data[i].lData,
        type: 'line',
        data: []
      })
    }
    if (!xAxisData.includes(data[i].xData)) {
      xAxisData.push(data[i].xData)
    }
  }
  for (let i = 0; i < data.length; i++) {
    for (let n = 0; n < tempArr.length; n++) {
      if (tempArr[n].name == data[i].lData) {
        tempArr[n].xData.push(data[i].xData)
        tempArr[n].yData.push(data[i].yData)
      }
    }
  }
  for (let i = 0; i < tempArr.length; i++) {
    for (let n = 0; n < tempArr[i].xData.length; n++) {
      let index = getIndex(tempArr[i].xData[n], xAxisData)
      expectedData[i].data[index] = tempArr[i].yData[n]
    }
  }
  lineData.legendData = legendData
  lineData.xAxisData = xAxisData
  lineData.expectedData = expectedData
  return lineData
}

export function handleLine(data, legendName) {
  let lineData = {}
  let xAxisData = []
  let yAxisData = []
  lineData.legendData = []
  lineData.legendData.push(legendName)
  for (const row of data) {
    xAxisData.push(row.xData)
    yAxisData.push(row.yData)
  }
  lineData.xAxisData = xAxisData
  let obj = {}
  obj.name = legendName
  obj.type = 'line'
  obj.data = yAxisData
  lineData.expectedData = []
  lineData.expectedData.push(obj)
  return lineData
}

export function handleCategory(data, size) {
  if (data.length == 0) {
    return {
      yData: []
    }
  }
  const s = size ? size : 10
  const length = data.length
  let xData = []
  let yData = []
  if (length < s) {
    for (let i = 0; i < s - length; i++) {
      xData.push(0)
      yData.push('')
    }
    for (let i = 0; i < length; i++) {
      let row = data[i]
      if (row) {
        xData.push(row.xData)
        yData.push(row.yData)
      }
    }
  } else {
    for (let i = 0; i < s; i++) {
      let row = data[i]
      if (row) {
        xData.push(row.xData)
        yData.push(row.yData)
      }
    }
  }
  let categoryData = {}
  categoryData.xData = xData
  categoryData.yData = yData
  return categoryData
}

/**
 * [1,2,3] => 1,2,3
 */
export function parseArray2String(arr) {
  if (arr.length > 0) {
    let stringify = JSON.stringify(arr)
    return stringify.substr(1, stringify.length - 2)
  } else {
    return null
  }
}

/**
 * 格式：2021-08-27 15:30
 * @returns {string}
 */
export function now() {
  let date = new Date()
  return date.getFullYear() + '-' + (num0(date.getMonth() + 1)) + '-' + num0(date.getDate()) + ' ' + num0(date.getHours()) + ':' + num0(date.getMinutes())
}
export function num0(num) {
  return num < 10 ? '0' + num : num
}


