import axios from 'axios';

// כתובת ה-API שלך - Fallback:
const fallbackUrl = "https://todolistserver-g9dd.onrender.com/items";

// ⬅️ התיקון הקריטי: בדיקה אם המשתנה ריק (או מחרוזת ריקה ""), אם כן, משתמשים ב-URL המלא המקובע.
const apiUrl = process.env.REACT_APP_API_BASE_URL 
               ? process.env.REACT_APP_API_BASE_URL 
               : fallbackUrl; 

console.log("API URL Loaded:", apiUrl); 

const apiService = {
  // שליפת כל המשימות (GET)
  getTasks: async () => {
    // apiUrl מכיל כעת את הכתובת המלאה כולל /items, לכן אין צורך להוסיף שוב
    const result = await axios.get(apiUrl); 
    return result.data;
  },

  // הוספת משימה חדשה (POST)
  addTask: async (name) => {
    if (!name) throw new Error("Name is required");
    // apiUrl מכיל כעת את הכתובת המלאה כולל /items, לכן אין צורך להוסיף שוב
    const result = await axios.post(apiUrl, { name, isComplete: false }); 
    return result.data;
  },

  // עדכון isComplete (PUT)
  setCompleted: async (id, isComplete, currentName) => {
    if (id == null) throw new Error("Id is required");
    // מוסיפים רק את ה-ID
    const result = await axios.put(`${apiUrl}/${id}`, { 
      id,
      name: currentName, 
      isComplete
    });
    return result.data;
  },

  // מחיקת משימה (DELETE)
  deleteTask: async (id) => {
    if (id == null) throw new Error("Id is required");
    // מוסיפים רק את ה-ID
    await axios.delete(`${apiUrl}/${id}`); 
  }
};

export default apiService;