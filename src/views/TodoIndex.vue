<template>
  <div class="grid my-20">
    <h1 class="text-2xl text-center">Todo List</h1>
    <div class="text-center mx-auto my-16">
      <input
        v-model="form.newTodoText"
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
          v-model="grid.perPage"
          class="w-28 border-b-2  py-2 px-3 rounded mr-2 hover:border-blue-400"
          @change="chagePage(1)"
        >
          <option :value="5">5개보기</option>
          <option :value="10" selected>10개보기</option>
          <option :value="20">20개보기</option>
          <option :value="30">30개보기</option>
        </select>
        <select
          v-model="filter.view"
          class="w-36 border-b-2 py-2 px-3 rounded hover:border-blue-400"
          @change="chagePage(1)"
        >
          <option value="all" selected>전체보기</option>
          <option value="complete">완료된 항목</option>
          <option value="progress">진행중인 항목</option>
        </select>
        <!-- TODO: 아이콘으로 변 경-->
        <button
          class="border-2 border-blue-400 py-1 px-3 rounded text-blue-400 ml-2 hover:border-blue-500 hover:text-blue-500"
          @click="refreshList"
        >
          필터초기화
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
            >{{ grid.totalCount }}</span
          >
        </th>
        <th>날짜</th>
        <th>삭제</th>
      </thead>
      <tbody v-if="grid.totalCount > 0">
        <tr v-for="todo in grid.todos" :key="todo.id">
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
            <a @click="deleteTodo(todo)">삭제</a>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="text-gray-500">
          <td colspan="5" class="text-center p-2">
            등록된 할 일이 없습니다. 할 일을 새로 추가하세요.
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="grid.totalCount > 0" class="flex items-center justify-center">
      <a class="border cursor-pointer" @click="chagePage(1)">처음</a>
      <a
        v-for="page in grid.totalPage"
        :key="page"
        class="mx-2 cursor-pointer"
        :class="{ curPage: grid.curPage === page }"
        @click="chagePage(page)"
      >
        {{ page }}</a
      >
      <a class="border cursor-pointer" @click="chagePage(grid.totalPage)">끝</a>
    </div>
    <div class="mx-auto">
      <input
        v-model="form.searchText"
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
import { getTodoList, createTodo, modifyTodo, deleteTodo } from '@/api/todo';
import { getFormatDate } from '@/utils/common';

export default {
  name: 'TodoIndex',
  data() {
    return {
      form: {
        newTodoText: '',
        searchText: '',
      },
      grid: {
        todos: [],
        curPage: 1,
        perPage: 10,
        totalCount: 0,
        totalPage: 10,
      },
      filter: {
        view: 'all',
      },
    };
  },
  created() {
    this.getTodos();
  },
  methods: {
    async getTodos() {
      const params = {
        _page: this.grid.curPage,
        _limit: this.grid.perPage,
        q: this.form.searchText,
      };
      if (this.filter.view !== 'all') {
        params.done = this.filter.view === 'complete' ? true : false;
      }
      const todos = await getTodoList(params);
      this.grid.todos = todos.data;
      this.grid.totalCount = todos.headers['x-total-count'];
      this.grid.totalPage = Math.ceil(this.grid.totalCount / this.grid.perPage);
    },
    chagePage(page) {
      this.grid.curPage = page;
      this.getTodos();
    },
    async addTodo() {
      if (this.form.newTodoText === '') return;
      if (this.form.newTodoText.length > 60) {
        return alert('60자 이내로 입력하세요.');
      }
      const newTodo = {
        text: this.form.newTodoText,
        date: getFormatDate(new Date()),
        done: false,
      };
      await createTodo(newTodo);
      this.chagePage(1);
    },
    async deleteTodo(todo) {
      await deleteTodo(todo.id);
      this.getTodos();
    },
    async doneTodo(todo) {
      await modifyTodo({
        id: todo.id,
        done: !todo.done,
      });
      this.getTodos();
    },
    searchTodo() {
      if (this.form.searchText === '') return;
      this.chagePage(1);
    },
    refreshList() {
      this.filter.view = 'all';
      this.form.newTodoText = '';
      this.form.searchText = '';
      this.chagePage(1);
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
