<template>
  <!-- 显示倒计时，并在休息模式下显示休息按钮 -->
  <div class="pomodoro-timer">
    <h1>{{ formattedTime }}</h1>
    <button v-if="isBreak && !isRunning" @click="startTimer">开始休息</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 初始化时间（秒）
const workTime = 1 * 10
const shortBreakTime = 5 * 60
const longBreakTime = 15 * 60

// 状态追踪
const timeLeft = ref(workTime)
const isRunning = ref(true)
const isBreak = ref(false)
const workSessions = ref(0)  // 记录已完成的工作周期数
let intervalId = null

// 计算属性：将剩余时间格式化为 MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
  const seconds = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

// 启动计时器
const startTimer = () => {
  isRunning.value = true
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleEndOfSession()  // 时间结束时触发相应函数
    }
  }, 1000)
}

// 停止计时器
const stopTimer = () => {
  clearInterval(intervalId)
  isRunning.value = false
}

// 处理计时结束的逻辑
const handleEndOfSession = () => {
  if (isBreak.value) {
    // 如果在休息模式，切换到工作模式
    switchToWorkMode()
  } else {
    // 如果在工作模式，记录一个工作周期，并切换到休息模式
    workSessions.value++
    if (workSessions.value % 2 === 0) {
      // 每两次工作周期进行一次大休息
      switchToLongBreakMode()
    } else {
      switchToShortBreakMode()
    }
  }
}

// 切换到工作模式
const switchToWorkMode = () => {
  isBreak.value = false
  timeLeft.value = workTime
}

// 切换到短休息模式
const switchToShortBreakMode = () => {
  isBreak.value = true
  timeLeft.value = shortBreakTime
  stopTimer()
  startTimer()  // 立即开始倒计时
}

// 切换到长休息模式
const switchToLongBreakMode = () => {
  isBreak.value = true
  timeLeft.value = longBreakTime
  stopTimer()
  startTimer()  // 立即开始倒计时
}

// 组件挂载时启动计时器
onMounted(() => {
  startTimer()
})
</script>

<style scoped>
.pomodoro-timer {
  text-align: center;
  font-family: Arial, sans-serif;
  background: rgba(0, 0, 0, 0); /* 背景透明 */
  color: #ff6347; /* 倒计时的颜色 */
}
h1 {
  font-size: 3rem;
}
button {
  padding: 10px 20px;
  font-size: 1.5rem;
  margin-top: 20px;
  background: #ff6347;
  color: #fff;
  border: none;
  border-radius: 5px;
}

</style>
