// Mock data service for Tasks module based on data_test.json
import mockData from '../../data/data_test.json';

// Simulates a delay for realistic async behavior
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTasksAPI = {
  // List all tasks with pagination
  async listTasksNewComplete(formData = {}) {
    await delay();
    return {
      ...mockData.list_tasks_new_complete.mock_response,
      messages: 'Success'
    };
  },

  // List logtasks for a specific task
  async listLogtasks(taskId) {
    await delay();
    return {
      ...mockData.list_logtasks.mock_response,
      messages: 'Success'
    };
  },

  // Get task counts
  async getTaskCounts() {
    await delay();
    return {
      ...mockData.get_task_counts.mock_response,
      messages: 'Success'
    };
  },

  // Get logtask details
  async getLogtaskDetails(logtaskId) {
    await delay();
    return {
      ...mockData.get_logtask_details.mock_response,
      messages: 'Success'
    };
  },

  // Get task status list
  async listTaskStatus() {
    await delay();
    return {
      ...mockData.list_task_status.mock_response,
      messages: 'Success'
    };
  },

  // Update task progress
  async updateTaskProgress(id, progress) {
    await delay();
    return {
       messages: 'Success',
      data: {
        id,
        progress,
        updated: true
      }
    };
  },

  // Delete logtask
  async deleteLogtask(logtaskId) {
    await delay();
    return {
      messages: 'Success',
      data: {
        id: logtaskId,
        deleted: true
      }
    };
  }
};
