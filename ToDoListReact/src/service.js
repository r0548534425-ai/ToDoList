import axios from 'axios';

// כתובת ה-API שלך - קיבוע סופי של הנתיב המלא
// נשתמש ב-URL המלא כדי למנוע כשלון אם הקיבוע של ה-Base URL נכשל שוב
const apiUrl = "https://todolistserver-g9dd.onrender.com/items"; // ⬅️ ה-URL המלא

console.log("API URL Loaded:", apiUrl); 
const apiService = {
  // שליפת כל המשימות
  getTasks: async () => {
    // ניגשים ישירות ל-apiUrl ללא הוספת "/items" נוסף
    const result = await axios.get(apiUrl); // ⬅️ רק apiUrl!
    return result.data;
  },

  // הוספת משימה חדשה
  addTask: async (name) => {
    if (!name) throw new Error("Name is required");
    // הנתיבים עם ID עדיין צריכים סלאש, אבל ה-ID נמצא אחריו
    const result = await axios.post(apiUrl, { name, isComplete: false });
    return result.data;
  },

  // עדכון isComplete בלבד
  setCompleted: async (id, isComplete, currentName) => {
    if (id == null) throw new Error("Id is required");
    const result = await axios.put(`${apiUrl}/${id}`, { // ⬅️ רק סלאש לפני ID
      id,
      name: currentName, 
      isComplete
    });
    return result.data;
  },

  // מחיקת משימה
  deleteTask: async (id) => {
    if (id == null) throw new Error("Id is required");
    await axios.delete(`${apiUrl}/${id}`); // ⬅️ רק סלאש לפני ID
  }
};

export default apiService;