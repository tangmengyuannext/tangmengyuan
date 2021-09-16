import request from '@/utils/request'

// 查询 License 证书是否有效
export function hasLicense() {
    return request({
        url: '/license',
        method: 'get'
    })
}

// 导入新 License
export function importLicense(data) {
    return request({
        url: '/importlicense',
        method: 'get',
        params: data
    })
}