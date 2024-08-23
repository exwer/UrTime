<template>
  <div class="event-list">
    <!-- 显示事件列表 -->
    <ul>
      <li v-for="(event, index) in events" :key="index">
        <input
          v-show="editingIndex === index"
          v-model="event.name"
          @keyup.enter="finishEditing"
          @blur="finishEditing"
          ref="eventInputs"
        />
        <span v-show="editingIndex !== index">{{ event.name }}</span>
        <button @click="editEvent(index)">编辑</button>
        <button @click="removeEvent(index)" @mousedown.prevent>删除</button>
      </li>
    </ul>
    <!-- 添加新事件 -->
    <button @click="addEvent" @mousedown.prevent>添加事件</button>
    <!-- 番茄钟组件 -->
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// 事件列表及编辑状态
const events = ref([{ name: '事件 1' }, { name: '事件 2' }])
const editingIndex = ref(-1)

const eventInputs = ref([])
// 添加事件
const addEvent = () => {
  events.value.push({ name: '' })
  editingIndex.value = events.value.length - 1
  nextTick(()=>{
    eventInputs.value[editingIndex.value].focus()
  })
}

// 删除事件
const removeEvent = (index) => {
  console.log('triggered')
  events.value.splice(index, 1)
  if (editingIndex.value >= index) {
    editingIndex.value = -1
  }
}

// 编辑事件
const editEvent = (index) => {
  editingIndex.value = index

  // // 等待DOM更新后聚焦输入框
  nextTick(() => {
    console.log(eventInputs.value,index)
    eventInputs.value[index].focus()
  })
}

// 完成编辑
const finishEditing = () => {
  if (editingIndex.value !== -1 && events.value[editingIndex.value].name.trim() === '') {
    removeEvent(editingIndex.value) // 删除空白的事件条目
  }
  editingIndex.value = -1
}
</script>

<style scoped>
.event-list {
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
span{
  color:black
}
</style>
