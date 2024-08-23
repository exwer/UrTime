<script setup lang="ts">
import EventList from './components/EventList.vue'


const ipcHandle = () => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <div>
    <EventList />
  </div>
</template>

<style>
body {
  margin: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0); /* 确保整个页面背景透明 */
}
button {
   -webkit-app-region: no-drag;
}
</style>
