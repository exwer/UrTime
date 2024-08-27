// @ts-expect-error defined in dts
const ipcRenderer = window.electron.ipcRenderer

// 获取任务列表
export async function fetchTasks() {
  const tasks = await ipcRenderer.invoke('get-tasks')
  return tasks
}

// 添加任务
export async function addTask(newTask: Task) {
  await ipcRenderer.invoke('add-task', newTask)
}

// 编辑任务
export async function editTask(index: number) {
  const updatedTask = { name: '更新后的任务', durations: [{ start: '', end: '' }] }
  await ipcRenderer.invoke('edit-task', index, updatedTask)
}

// 删除任务
export async function removeTask(index: number) {
  await ipcRenderer.invoke('remove-task', index)
}

// 保存用时
export async function saveDuration() {

}
