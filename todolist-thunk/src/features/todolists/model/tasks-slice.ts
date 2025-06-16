// import { nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { createAppSlice } from "@/common/utils"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
// {
//   'todoId1': [{id: 1, title: 'a'}],
//   'todoId2': [{id: 10, title: 'aa'}],
// }

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  reducers: (create) => ({
    // actions

    // thunks (async action)
    fetchTasks: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId) //todolistId попадает сюда в качестве параметра
          return { task: res.data.items, todolistId }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.task
        }
      }
    ),
    createTasks: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { rejectWithValue }) => {
        try {
          const res = await tasksApi.createTask(args)
          return { tasks: res.data.data.item }
        } catch (error) {
          return rejectWithValue(null)
        }
      }, {
        fulfilled: (state, action) => {
          const task = action.payload.tasks
          state[action.payload.tasks.todoListId].unshift(task)
        }
      }
    ),
    deleteTasks: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, { rejectWithValue }) => {
        try {
          await tasksApi.deleteTask(args)
          return args
        } catch (error) {
          return rejectWithValue(null)
        }
      }, {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        }
      }),
    changeTaskStatus: create.asyncThunk(
      async (task: DomainTask, { rejectWithValue }) => {
        try {
            const res = await tasksApi.updateTask({ taskId: task.id, todolistId: task.todoListId, model: task })
            return { task: res.data.data.item }

        } catch (error) {
          return rejectWithValue(null)
        }
      }, {
        fulfilled: (state, action) => {
          const updateTask = action.payload.task
          const task = state[updateTask.todoListId].find((task) => task.id === updateTask.id)
          if (task) {
            task.status = updateTask.status
          }
        }
      }
    ),
    // changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
    //   const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
    //   if (task) {
    //     task.status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.New
    //   }
    // }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),
})

export const { selectTasks } = tasksSlice.selectors
export const { changeTaskTitleAC, fetchTasks, createTasks, deleteTasks, changeTaskStatus } = tasksSlice.actions // чтобы диспатчить санку нужно ее достать из экшенов
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]> // Record встроенный утилитный тип TypeScript.
