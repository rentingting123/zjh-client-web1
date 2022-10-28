import request from '@/utils/request'


export function getBaseInfo(query) {
  return request.get('/app/academic/progress/getBaseInfo',query)
}

export function getMidExamine(query) {
  return request.get('/app/academic/progress/getMidExamine',query)
}
export function getPreGraduateInfo(query) {
  return request.get('/app/academic/progress/getPreGraduateInfo',query)
}
export function getRewardPunish(query) {
  return request.get('/app/academic/progress/getRewardPunish',query)
}

export function getOpening(query) {
  return request.get('/app/academic/progress/getOpening',query)
}

export function getAchievement(query) {
  return request.get('/app/academic/progress/getAchievement',query)
}

export function getReadReport(query) {
  return request.get('/app/academic/progress/getReadReport',query)
}

export function getCourseResult(query) {
  return request.get('/app/academic/progress/getCourseResult',query)
}

export function getPreReplay(query) {
  return request.get('/app/academic/progress/getPreReplay',query)
}

