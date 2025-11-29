import axios from 'axios';

// כתובת ה-API שלךמפ
const apiUrl = "https://todolist1-j5q6.onrender.com";

const apiService = {
  // שליפת כל המשימות
  getTasks: async () => {
    const result = await axios.get(`${apiUrl}/items`);
    return result.data;
  },

  // הוספת משימה חדשה
  addTask: async (name) => {
    if (!name) throw new Error("Name is required");
    const result = await axios.post(`${apiUrl}/items`, { name, isComplete: false });
    return result.data;
  },

  // עדכון isComplete בלבד
  setCompleted: async (id, isComplete, currentName) => {
    if (id == null) throw new Error("Id is required");
    // שולחים את האובייקט המלא כדי שהbackend לא יאבד את השם
    const result = await axios.put(`${apiUrl}/items/${id}`, {
      id,
      name: currentName, 
      isComplete
    });
    return result.data;
  },

  // מחיקת משימה
  deleteTask: async (id) => {
    if (id == null) throw new Error("Id is required");
    await axios.delete(`${apiUrl}/items/${id}`);
  }
};

export default apiService;
