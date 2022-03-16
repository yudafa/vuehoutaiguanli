import request from '@/utils/request'

export function getUsers(data) {
  return request.get('users', {
    params: data,
  })
}
