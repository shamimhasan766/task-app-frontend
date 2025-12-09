<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import axiosInstance from '../utils/axiosConfig'
    import { useRouter } from 'vue-router'

    const router = useRouter();
    const tasks = ref([])

    const showModal = ref(false)
    const editingTask = ref(false)
    const editingTaskId = ref(null)

    const formData = reactive({
        title: '',
        description: ''
    })

    const handleAddTask = () => {
        formData.title = ''
        formData.description = ''
        editingTask.value = false
        editingTaskId.value = null
        showModal.value = true
    }

    const handleEditTask = (task) => {
        formData.title = task.title
        formData.description = task.description
        editingTask.value = true
        editingTaskId.value = task.id
        showModal.value = true
        }

        const handleDeleteTask = async (taskId) => {
        const confirmed = confirm('Are you sure you want to delete this task?')
        if (!confirmed) return

        await axiosInstance.delete(`/tasks/${taskId}`);

        tasks.value = tasks.value.filter(task => task.id !== taskId)
        }

        const handleSubmit = async () => {
        if (!formData.title || !formData.description) {
            alert('Please fill out all fields')
            return
        }

        if (editingTask.value) {
            await axiosInstance.put(`/tasks/${editingTaskId.value}`, formData);
            const index = tasks.value.findIndex(t => t.id === editingTaskId.value)
            if (index !== -1) {
            tasks.value[index].title = formData.title
            tasks.value[index].description = formData.description
            }
        } else {
            const response = await axiosInstance.post('/tasks', formData);
            tasks.value.unshift(response.data.task)
        }

        showModal.value = false
    }

    const handleLogout = async () => {
        localStorage.removeItem('access_token');
        router.push('/')
    }
    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks')
            tasks.value = response.data.data
        } catch (error) {
            console.error(error)
            alert('Failed to load tasks')
        }
    }

    onMounted(() => {
        fetchTasks()
    })
</script>


<template>
    <div class="flex flex-end">
        <div class="text-center bg-green-500 px-2 py-1 rounded-lg w-24 text-white cursor-pointer" @click="handleLogout">Logout</div>
    </div>
  <div class="bg-gray-50 p-4 max-w-[500px]">
    <div class="">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl text-gray-800">Task List</h3>
        <div
          @click="handleAddTask"
          class="bg-teal-500 rounded-lg px-3 py-1 text-white font-bold cursor-pointer"
        >
          Add Task
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <table class="w-full">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="text-left p-4 font-semibold text-gray-700">Title</th>
              <th class="text-left p-4 font-semibold text-gray-700">Description</th>
              <th class="text-right p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tasks.length === 0">
              <td colspan="3" class="text-center p-8 text-gray-500">
                No tasks yet. Click "Add Task" to create one.
              </td>
            </tr>
            <tr v-for="task in tasks" :key="task.id" class="border-b hover:bg-gray-50">
              <td class="p-4 font-medium text-gray-800">{{ task.title }}</td>
              <td class="p-4 text-gray-600">{{ task.description }}</td>
              <td class="p-4">
                <div class="flex justify-end gap-2">
                  <div
                    @click="handleEditTask(task)"
                    class="p-2 text-blue-600 cursor-pointer"
                  >
                    Edit
                  </div>
                  <div
                    @click="handleDeleteTask(task.id)"
                    class="p-2 text-red-600 cursor-pointer"
                  >
                   Delete
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">
            {{ editingTask ? 'Edit Task' : 'Add Task' }}
          </h2>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2 text-left">Title</label>
            <input
              type="text"
              v-model="formData.title"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-2 text-left">Description</label>
            <textarea
              v-model="formData.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button
              @click="showModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <div
              @click="handleSubmit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              {{ editingTask ? 'Update' : 'Add' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>