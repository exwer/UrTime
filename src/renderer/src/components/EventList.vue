<script setup lang="ts">
import { nextTick, ref } from 'vue'
import * as API from '../api/index'

// 事件列表及编辑状态
const tasks = ref<Task[]>([])
const editingIndex = ref(-1)

const taskInputs = ref<any>([])

async function getTasks() {
  const tasks = await API.fetchTasks()
  if (tasks) {
    tasks.value = tasks
  }
}
getTasks()

// 添加事件
async function addTask() {
  // 处理id:列表最大id+1
  // createAt, updatedAt相同
  // TODO:status当前默认永久
  // const newTask = {}
  // await API.addTask()
  // await getTasks()

  editingIndex.value = tasks.value.length - 1
  nextTick(() => {
    taskInputs.value[editingIndex.value].focus()
  })
}

// 删除事件
function removeTask(index: number) {
  tasks.value.splice(index, 1)
  if (editingIndex.value >= index) {
    editingIndex.value = -1
  }
}

// 编辑事件
function editTask(index: number) {
  editingIndex.value = index

  // // 等待DOM更新后聚焦输入框
  nextTick(() => {
    taskInputs.value[index].focus()
  })
}

// 完成编辑
function finishEditing() {
  if (editingIndex.value !== -1 && tasks.value[editingIndex.value].name.trim() === '') {
    removeTask(editingIndex.value) // 删除空白的事件条目
  }
  editingIndex.value = -1
}

function startTimer() {

}
</script>

<template>
  <div class="task-list">
    <!-- 显示事件列表 -->
    <ul>
      <li
        v-for="(task, index) in tasks"
        :key="index"
        @click="startTimer"
      >
        <input
          v-show="editingIndex === index"
          ref="taskInputs"
          v-model="task.name"
          @keyup.enter="finishEditing"
          @blur="finishEditing"
        >
        <span v-show="editingIndex !== index">{{ task.name }}</span>
        <button @click="editTask(index)">
          编辑
        </button>
        <button
          @click="removeTask(index)"
          @mousedown.prevent
        >
          删除
        </button>
      </li>
    </ul>
    <!-- 添加新事件 -->
    <button
      @click="addTask"
      @mousedown.prevent
    >
      添加事件
    </button>
    <!-- 番茄钟组件 -->
  </div>
</template>

<style scoped lang="scss">
.task-list {
  background: rgba(0, 0, 0, 0);
  color: #ffffff;
}

ul {
  padding: 0;
  list-style-type: none;
}

li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

button {
  margin-left: 10px;
  background: #ff6347;
  color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

span {
  color: black
}
</style>
