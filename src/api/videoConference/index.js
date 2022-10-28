import request from '@/utils/request'

// 开始会议
export function createConference(query) {
  return request({
    url: '/screen/ordinary/create/conference',
    method: 'get',
    data: query
  })
}


