import request from '@/utils/request'

export function addNotice(params) {
  return request({
    url: '/shen-hua/action/addNotice',
    method: 'get',
    params
  })
}
export function getMenu(params) {
  return request({
    url: '/shen-hua/show/getMenu',
    method: 'get',
    params
  })
}
export function toggleMenu(params) {
  return request({
    url: '/shen-hua/action/toggleMenu',
    method: 'get',
    params
  })
}
export function updateEncrypt(params) {
  return request({
    url: '/shen-hua/action/updateEncrypt',
    method: 'get',
    params
  })
}
export function getVideoList(params) {
  return request({
    url: '/shen-hua/show/getVideoList',
    method: 'get',
    params
  })
}
export function deleteVideo(params) {
  return request({
    url: '/shen-hua/action/deleteVideo',
    method: 'get',
    params
  })
} 
export function deleteMusic(params) {
  return request({
    url: '/shen-hua/action/deleteMusic',
    method: 'get',
    params
  })
} 
export function deleteHomeMusic(params) {
  return request({
    url: '/shen-hua/action/deleteHomeMusic',
    method: 'get',
    params
  })
} 
export function uploadHomeMusic(data) {
  return request({
    url: '/shen-hua/action/uploadHomeMusic',
    method: 'post',
    data
  })
} 
export function updateFilePassword(data) {
  return request({
    url: '/shen-hua/action/updateFilePassword',
    method: 'post',
    data
  })
} 
