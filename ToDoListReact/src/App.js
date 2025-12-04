import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, CheckSquare, PlusCircle, X } from 'lucide-react'; 
import './style.css';

// 🛑 IMPORTANT: Use an environment variable if available, otherwise fallback to the hardcoded URL.
// The hardcoded URL MUST point to the Backend (Server) URL, not the Frontend URL.
// IF YOUR BACKEND ADDRESS IS DIFFERENT, CHANGE IT HERE.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://todolistserver-g9dd.onrender.com"; 

// --- API Service Implementation (Integrated) ---

// Function to handle API call retry with exponential backoff
const fetchWithRetry = async (fetchFunction) => {
  const maxRetries = 5;
  let delay = 1000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFunction();
    } catch (error) {
      if (i === maxRetries - 1) {
        // Only log a hard error on final failure
        console.error("API call failed after multiple retries:", error);
        throw error;
      }
      // Log warning for retry attempts
      console.warn(`Retry attempt ${i + 1} of ${maxRetries}. Retrying in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

const apiService = {
  // Expose the URL for the App component to display it in the UI
  apiUrl: API_BASE_URL,

  // GET: Fetch all tasks
  getTasks: async function() {
    return fetchWithRetry(async () => {
      // Use API_BASE_URL directly since the service is defined within the same file scope
      const result = await axios.get(`${API_BASE_URL}/items`);
      return result.data;
    });
  },

  // POST: Add new task
  addTask: async function(name) {
    if (!name) throw new Error("Name is required");
    return fetchWithRetry(async () => {
      const result = await axios.post(`${API_BASE_URL}/items`, { name, isComplete: false });
      return result.data;
    });
  },

  // PUT: Toggle completion status
  setCompleted: async function(id, isComplete, currentName) {
    if (id == null) throw new Error("Id is required");
    return fetchWithRetry(async () => {
      const result = await axios.put(`${API_BASE_URL}/items/${id}`, {
        id,
        name: currentName, 
        isComplete
      });
      return result.data;
    });
  },

  // DELETE: Delete a task
  deleteTask: async function(id) {
    if (id == null) throw new Error("Id is required");
    return fetchWithRetry(async () => {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
    });
  },
  
  // PUT: Edit task name
  editTask: async function(id, newName, isComplete) {
    if (id == null || !newName) throw new Error("Id and name are required");
    return fetchWithRetry(async () => {
      const result = await axios.put(`${API_BASE_URL}/items/${id}`, {
        id,
        name: newName,
        isComplete
      });
      return result.data;
    });
  }
};
// --- End of API Service Implementation ---


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // 1. Fetch Tasks on Load
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getTasks();
      // Ensure the data is an array
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
        setError("Received unexpected data format from the server.");
      }
    } catch (e) {
      // Display the exact URL that failed in the error message
      setError(`Failed to load tasks from: ${apiService.apiUrl}. Please ensure the backend server is running and accessible.`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Handlers for CRUD operations
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskName.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      await apiService.addTask(newTaskName.trim());
      setNewTaskName('');
      await fetchTasks();
    } catch (e) {
      setError("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteTask(id);
      // Optimistically update the UI, or re-fetch
      setTasks(tasks.filter(task => task.id !== id));
    } catch (e) {
      setError("Failed to delete task.");
      await fetchTasks();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    setLoading(true);
    setError(null);
    try {
      const newCompletionStatus = !task.isComplete;
      await apiService.setCompleted(task.id, newCompletionStatus, task.name);
      
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, isComplete: newCompletionStatus } : t
      ));
    } catch (e) {
      setError("Failed to update task completion status.");
      await fetchTasks();
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (task) => {
    setEditingId(task.id);
    setEditingName(task.name);
  };

  const handleSaveEdit = async (id, isComplete) => {
    if (editingName.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      await apiService.editTask(id, editingName.trim(), isComplete);
      setEditingId(null);
      setEditingName('');
      await fetchTasks(); // Re-fetch to confirm change
    } catch (e) {
      setError("Failed to update task name.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };


  // 3. UI Rendering
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-6 md:p-8 mt-10">
        
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
          My To-Do List
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
            Backend URL: <code className="text-xs font-mono bg-gray-100 p-1 rounded">{apiService.apiUrl}</code>
        </p>

        {/* Error/Loading Messages */}
        {loading && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg flex items-center justify-center mb-4">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            טוען...
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">שגיאה: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* New Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="הוסף משימה חדשה..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-150 flex items-center shadow-md disabled:bg-gray-400"
            disabled={newTaskName.trim() === '' || loading}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            הוסף
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 py-8">אין משימות כרגע. הוסף משימה חדשה!</p>
          )}

          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center p-4 rounded-lg shadow-sm transition duration-200 
                ${task.isComplete ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white border border-gray-200 hover:shadow-md'}`
              }
            >
              
              {editingId === task.id ? (
                // Edit Mode
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-grow p-1 border-b-2 border-blue-500 focus:outline-none text-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(task.id, task.isComplete);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
              ) : (
                // View Mode
                <span
                  className={`flex-grow text-lg truncate cursor-pointer ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-800'}`}
                  onClick={() => handleToggleComplete(task)}
                >
                  {task.name}
                </span>
              )}
              


              {/* Action Buttons */}
              <div className="flex space-x-2 ml-4">
                {editingId === task.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(task.id, task.isComplete)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
                      title="שמור שינוי"
                    >
                      <CheckSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                      title="בטל עריכה"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(task)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
                      title="ערוך משימה"
                      disabled={loading}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                      title="מחק משימה"
                      disabled={loading}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;