import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, CheckSquare, Square } from 'lucide-react';

// =================================================================
// 1. API SERVICE (service.js content is embedded here)
// Note: In a production environment, Render must successfully inject
// the REACT_APP_API_BASE_URL environment variable during the build process.
// =================================================================

// Fallback is used if environment variable is not injected during build
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://todolistserver-g9dd.onrender.com";

console.log("API URL Loaded:", API_BASE_URL);

const apiService = {
  getTasks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Throw error to be caught by the component
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  },

  addTask: async (name) => {
    // Basic local validation
    if (!name || name.trim() === "") {
        throw new Error("Name is required");
    }
    const newTask = {
      name: name.trim(),
      isComplete: false,
    };
    try {
      await axios.post(`${API_BASE_URL}/items`, newTask);
    } catch (error) {
      console.error("Error adding task:", error);
      throw new Error(`Failed to add task: ${error.message}`);
    }
  },

  updateTask: async (id, name, isComplete) => {
    if (!name || name.trim() === "") {
        throw new Error("Name is required for update");
    }
    const updatedTask = {
      name: name.trim(),
      isComplete: isComplete,
      id: id,
    };
    try {
      await axios.put(`${API_BASE_URL}/items/${id}`, updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error(`Failed to update task: ${error.message}`);
    }
  },

  deleteTask: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  },
};

// =================================================================
// 2. MAIN APPLICATION COMPONENT
// =================================================================

const TaskItem = ({ task, onToggle, onDelete, onEdit, isEditing, onSaveEdit, onCancelEdit, newName, onNameChange }) => {
  return (
    <div className={`flex items-center justify-between p-3 my-2 bg-white rounded-lg shadow-md transition duration-200 ease-in-out ${task.isComplete ? 'opacity-60' : 'hover:shadow-lg'}`}>
      <div className="flex items-center flex-grow">
        {/* Toggle Checkbox/Icon */}
        <button
          onClick={() => onToggle(task.id, task.name, !task.isComplete)}
          className="mr-3 p-1 text-gray-500 hover:text-green-600 transition"
          aria-label={task.isComplete ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.isComplete ? <CheckSquare className="text-green-600" size={20} /> : <Square size={20} />}
        </button>

        {/* Task Name or Edit Input */}
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={onNameChange}
            className="flex-grow p-1 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 text-lg"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit(task.id);
              if (e.key === 'Escape') onCancelEdit();
            }}
          />
        ) : (
          <span className={`text-lg break-words ${task.isComplete ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.name}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={() => onSaveEdit(task.id)}
              className="p-1 text-white bg-blue-500 rounded hover:bg-blue-600 transition text-sm"
              title="Save"
            >
              שמור
            </button>
            <button
              onClick={onCancelEdit}
              className="p-1 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
              title="Cancel"
            >
              בטל
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-blue-500 hover:text-blue-700 transition"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-red-500 hover:text-red-700 transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // ------------------------------------
  // Task Fetching
  // ------------------------------------
  const getTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getTasks();
      setTodos(data);
    } catch (e) {
      console.error("Initial fetch failed:", e);
      setError("Failed to load tasks. Check API connection and CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // ------------------------------------
  // Create Task (with Input Validation)
  // ------------------------------------
  async function createTodo(e) {
    e.preventDefault();
    setError(null);

    // ✅ התיקון ללוגיקה: בדיקת אימות קלט ריק
    if (!newTodo.trim()) {
        console.warn("Attempted to submit an empty task.");
        return; // עוצר את שליחת המשימה אם היא ריקה
    }

    try {
      await apiService.addTask(newTodo);
      setNewTodo(""); // Clear input
      await getTodos(); // Refresh tasks list
    } catch (e) {
      console.error("Error adding todo:", e);
      setError(`Failed to add task: ${e.message}`);
    }
  }

  // ------------------------------------
  // Update Task Status (Toggle Complete)
  // ------------------------------------
  async function toggleComplete(id, name, isComplete) {
    setError(null);
    try {
      await apiService.updateTask(id, name, isComplete);
      await getTodos();
    } catch (e) {
      console.error("Error toggling completion:", e);
      setError(`Failed to toggle task status: ${e.message}`);
    }
  }

  // ------------------------------------
  // Delete Task
  // ------------------------------------
  async function deleteTodo(id) {
    setError(null);
    try {
      await apiService.deleteTask(id);
      await getTodos();
    } catch (e) {
      console.error("Error deleting todo:", e);
      setError(`Failed to delete task: ${e.message}`);
    }
  }

  // ------------------------------------
  // Edit Handlers
  // ------------------------------------
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingName(task.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async (id) => {
    setError(null);
    if (!editingName.trim()) {
        setError("Task name cannot be empty.");
        return;
    }
    
    try {
        // Find the current completion status
        const currentTask = todos.find(t => t.id === id);
        if (currentTask) {
            await apiService.updateTask(id, editingName, currentTask.isComplete);
            setEditingId(null);
            setEditingName('');
            await getTodos();
        }
    } catch (e) {
        console.error("Error saving edit:", e);
        setError(`Failed to save changes: ${e.message}`);
    }
  };

  // ------------------------------------
  // Render UI
  // ------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6 border-b pb-3">
          Todo List App
        </h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p className="font-bold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Add New Todo Form */}
        <form onSubmit={createTodo} className="flex mb-6 shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            className="flex-grow p-4 text-gray-700 border-none focus:ring-0 text-lg"
            placeholder="הוסף משימה חדשה..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-4 font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
            disabled={!newTodo.trim()}
          >
            הוסף
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 py-10">
            <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">טוען משימות...</p>
          </div>
        )}

        {/* Todo List */}
        {!loading && todos.length === 0 && !error && (
          <p className="text-center text-gray-500 py-10">אין משימות כרגע. התחל להוסיף!</p>
        )}
        
        <div className="space-y-3">
          {todos.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={toggleComplete} 
              onDelete={deleteTodo}
              onEdit={startEdit}
              isEditing={editingId === task.id}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              newName={editingName}
              onNameChange={(e) => setEditingName(e.target.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}