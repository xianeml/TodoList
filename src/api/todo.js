import request from '@/utils/request';

export const getTodoList = params => {
  return request({
    url: '/api/todo?_sort=done,id&_order=asc,desc',
    method: 'GET',
    params,
    meta: {
      useResponseAll: true,
    },
  });
};
