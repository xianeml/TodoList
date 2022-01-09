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

export const createTodo = data => {
  return request({
    url: '/api/todo',
    method: 'POST',
    data,
  });
};

export const modifyTodo = data => {
  return request({
    url: `/api/todo/${data.id}`,
    method: 'PATCH',
    data,
  });
};

export const deleteTodo = id => {
  return request({
    url: `/api/todo/${id}`,
    method: 'DELETE',
  });
};
