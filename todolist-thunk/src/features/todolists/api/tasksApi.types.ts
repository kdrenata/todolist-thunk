import type { TaskPriority, TaskStatus } from "@/common/enums/enums"

export type DomainTask = {
  description: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type UpdateTaskModel = {
  description: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string
  deadline: string
}
// type UpdateTaskModel2 = Partial<UpdateTaskModel> делает свойства не обязательными
// type UpdateTaskModel2 = Required<UpdateTaskModel> делает свойства обязательными
// type UpdateTaskModel2 = Omit<UpdateTaskModel, 'deadline' | 'title'> убирает ненужные свойства
// type UpdateTaskModel2 = Pick<UpdateTaskModel, 'deadline'> достает нужные свойства, в данном случае достанет 'deadline'