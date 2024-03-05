<script setup lang="ts">
import TodoGroup from './components/TodoGroup.vue';
import { TodoStatus } from './types/todoInterface';
import { ref } from 'vue';
import todoType from './types/todoInterface';

interface Props {
    status: TodoStatus;
}
  const props = defineProps<Props>();
  const todos = ref<todoType[]>([]);

const newTodoTitle =ref('');

const addTodo = async (todo: todoType) => {
  const response = await fetch('http://localhost:3000/api/todo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error('Failed to add todo');
  }
  return await response.json();
};

const addNewTodo = async () => {
    if (newTodoTitle.value.trim()) {
        const newTodo = await addTodo({
            id: 1,
            title: newTodoTitle.value,
            status: TodoStatus.Pending,
        });
        if (props.status === newTodo.status) {
            todos.value.push(newTodo);
        }
        newTodoTitle.value='';
    }
  }

</script>

<template>
  <div class ="wrapper">
    <h1>TODO LIST:</h1>
    <div class ="add-todo">
      <input v-model="newTodoTitle" placeholder="Add new Todo" />
      <button @click="addNewTodo">Add Todo</button>
    </div>
    <div class="todo-grid">
    <TodoGroup :status ="TodoStatus.Pending" />
    <TodoGroup :status ="TodoStatus.InProgress" />
    <TodoGroup :status = "TodoStatus.Completed" />
  </div>
  </div>
</template>

<style scoped>
.todo-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 40px;
}

.wrapper {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
    header .wrapper{
      display: flex;
      place-items: flex-start;
      padding-right: calc(var(--section-gap) /2);
    }
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
