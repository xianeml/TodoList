<template>
  <div class="grid my-20">
    <h1 class="text-2xl text-center">Todo List</h1>
    <div class="text-center mx-auto my-16">
      <input
        v-model="newTodoText"
        type="text"
        class="w-96 border-b-2 py-2 px-3 mr-2 hover:border-blue-400 focus:border-blue-400 focus:shadow-sm"
        placeholder="할 일을 입력하세요"
        @keyup.enter="addTodo"
      />
      <button
        class="bg-blue-400 py-2 px-3 rounded text-white hover:bg-blue-500"
        @click="addTodo"
      >
        추가
      </button>
    </div>
    <div class="flex w-9/12 mx-auto mb-4">
      <div class="flex-1 text-right">
        <select
          v-model="perPage"
          class="w-28 border-b-2  py-2 px-3 rounded mr-2 hover:border-blue-400"
          @change="setCurPage(1)"
        >
          <option value="5">5개보기</option>
          <option value="10" selected>10개보기</option>
          <option value="20">20개보기</option>
          <option value="30">30개보기</option>
        </select>
        <select
          v-model="viewFilter"
          class="w-36 border-b-2 py-2 px-3 rounded hover:border-blue-400"
          @change="setViewFilter"
        >
          <option value="allTodos" selected>전체보기</option>
          <option value="complete">완료된 항목</option>
          <option value="progress">진행중인 항목</option>
        </select>
        <button
          class="border-2 border-blue-400 py-1 px-3 rounded text-blue-400 ml-2 hover:border-blue-500 hover:text-blue-500"
          @click="showList"
        >
          목록보기
        </button>
      </div>
    </div>
    <table class="w-9/12 mx-auto mb-8 border-2">
      <thead class="thead border-b-2">
        <th class="py-2">완료</th>
        <th>No</th>
        <th>
          할 일
          <span
            class="flex-none text-sm mr-4 bg-blue-400 text-white rounded-full ml-2 p-1"
            >{{ totalCount }}</span
          >
        </th>
        <th>날짜</th>
        <th>삭제</th>
      </thead>
      <tbody>
        <tr v-for="todo in todos" :key="todo.id">
          <td class="w-20 text-center">
            <input
              type="checkbox"
              class="cursor-pointer text-center"
              :checked="todo.done"
              @click="doneTodo(todo)"
            />
          </td>
          <td class="w-24 text-center">{{ todo.id }}</td>
          <td
            class="hover:text-gray-400 hover:line-through cursor-pointer pl-6"
            :class="{ doneDeco: todo.done }"
            @click="doneTodo(todo)"
          >
            {{ todo.text }}
          </td>
          <td class="w-2/12 text-center">{{ todo.date }}</td>
          <td
            class="w-1/12 text-center text-red-500 hover:text-red-700 cursor-pointer"
          >
            <a @click="deleteTodo(todo.id)">삭제</a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-center">
      <a class="border cursor-pointer" @click="setCurPage(1)">처음</a>
      <a
        v-for="page in totalPage"
        :key="page"
        class="mx-2 cursor-pointer"
        :class="{ curPage: curPage === page }"
        @click="setCurPage(page)"
      >
        {{ page }}</a
      >
      <a class="border cursor-pointer">끝</a>
    </div>
    <div class="mx-auto">
      <input
        v-model="searchTerm"
        type="text"
        class="w-72 mt-12 border-b-2 py-2 px-3 mr-2 hover:border-blue-400 focus:border-blue-400 focus:shadow-sm"
        placeholder="검색어를 입력하세요"
        @keyup.enter="searchTodo"
      /><button
        class="border-2 border-blue-400 py-2 px-3 rounded text-blue-400 hover:border-blue-500 hover:text-blue-500"
        @click="searchTodo"
      >
        검색
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getTodoList } from '@/api/todo';

export default {
  name: 'TodoIndex',
  data() {
    return {
      todos: [],
      newTodoText: '',
      perPage: 10,
      curPage: 1,
      totalCount: 0,
      totalPage: 10,
      viewFilter: 'allTodos',
      done: '',
      searchTerm: '',
    };
  },
  created() {
    this.getTodos();
  },
  methods: {
    async getTodos() {
      const getTodosParams = {
        _page: this.curPage,
        _limit: this.perPage,
        q: this.searchTerm,
      };
      if (this.done === true || this.done === false) {
        getTodosParams.done = this.done;
      }
      const todosData = await getTodoList(getTodosParams);
      this.todos = todosData.data;
      this.totalCount = todosData.headers['x-total-count'];
      this.totalPage = Math.ceil(this.totalCount / this.perPage);
    },
    setCurPage(page) {
      this.curPage = page;
      this.getTodos();
    },
    setViewFilter() {
      if (this.viewFilter === 'complete') {
        this.done = true;
      } else if (this.viewFilter === 'progress') {
        this.done = false;
      } else if (this.viewFilter === 'allTodos') {
        this.done = '';
      }
      this.setCurPage(1);
    },
    async addTodo() {
      if (this.newTodoText === '') {
        return;
      }
      if (this.newTodoText.length > 60) {
        alert('60자 제한');
        return;
      }
      const newTodoObj = {
        text: this.newTodoText,
        date: this.getFormatDate(new Date()),
        done: false,
      };
      await axios.post('/api/todo', newTodoObj);
      this.newTodoText = '';
      this.viewFilter = 'allTodos';
      this.setViewFilter();
    },
    async deleteTodo(id) {
      await axios.delete(`/api/todo/${id}`);
      this.getTodos();
    },
    async doneTodo(todo) {
      const done = !todo.done;
      await axios.patch(`/api/todo/${todo.id}`, {
        done: done,
      });
      this.getTodos();
    },
    searchTodo() {
      if (this.searchTerm === '') {
        return;
      }
      this.setCurPage(1);
    },
    showList() {
      this.viewFilter = 'allTodos';
      this.done = '';
      this.searchTerm = '';
      this.setCurPage(1);
    },
    getFormatDate(date) {
      const year = date.getFullYear();
      let month = 1 + date.getMonth();
      month = month >= 10 ? month : '0' + month;
      let day = date.getDate();
      day = day >= 10 ? day : '0' + day;
      return year + '-' + month + '-' + day;
    },
  },
};
</script>

<style lang="scss">
.doneDeco {
  @apply line-through text-gray-400;
}

input {
  outline: none;
}

.curPage {
  @apply text-blue-400 font-bold border-b-2 border-blue-400;
}
</style>
