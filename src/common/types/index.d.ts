// global

declare interface Task {
  id: number
  name: string
  description?: string
  durations?: { start: string, end: string, elapsed?: number }[]
  status: 'in-progress' | 'completed' | 'cancelled' | 'permanent'
  createdAt: string
  UpdatedAt: string
  dueDate?: string // TODO 截止日期
  priority?: number // TODO 优先级类型
  tags?: string[] // TODO 标签类型
  subtasks?: unknown // TODO 子任务类型
}
