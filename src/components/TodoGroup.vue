<script setup lang="ts">
import todoType from '../types/todoInterface';
import { onMounted, ref } from 'vue';
import { TodoStatus } from '../types/todoInterface';
import { computed } from 'vue';

interface Props {
    status: TodoStatus;
}
   const props = defineProps<Props>();
   const todos = ref<todoType[]>([]);

   const fetchTodos = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/todo')
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const data: todoType[] = await response.json();
        todos.value = data.filter(todo => todo.status === props.status);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
   };

   onMounted(fetchTodos);

   const groupLabel = computed(() => {
    switch(props.status) {
        case TodoStatus.Pending:
            return "Pending";
        case TodoStatus.InProgress:
            return "In Progress";
        case TodoStatus.Completed:
            return "Completed";
        default:
            return "Todo Group"
    }
   });

   const updateTodoStatus = async (id: number, newStatus: TodoStatus) => {
    try {
        const response = await fetch(`http://localhost:3000/api/todo/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) {
            throw new Error('Failed to update todo');
        }
        await fetchTodos(); // Re-fetch todos to reflect the update
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}


</script>
<template>
    <div>
        <h3>{{ groupLabel }}</h3>
        <ul>
            <li v-for="todo in todos" :key="todo.id">
                {{ todo.title }}
            <button 
            v-if="todo.status === TodoStatus.Pending"
            @click="updateTodoStatus(todo.id, TodoStatus.InProgress)"> 
            Mark as in progress
        </button>
        <button
        v-if="todo.status === TodoStatus.InProgress"
        @click="updateTodoStatus(todo.id, TodoStatus.Completed)">
        Mark as completed
    </button>
         </li>
        </ul>
    </div>
</template>HeadersResponseResponse