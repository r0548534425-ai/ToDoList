import axios from 'axios';

// כתובת ה-API שלך - REACT_APP_API_BASE_URL יכיל רק את הדומיין (כפי שנטען עכשיו)
const apiUrl = process.env.REACT_APP_API_BASE_URL; 

console.log("API URL Loaded:", apiUrl); 
const apiService = {
  // שליפת כל המשימות (GET)
  getTasks: async () => {
    // מוסיפים את הנתיב /items
    const result = await axios.get(`${apiUrl}/items`); // ⬅️ הוספנו /items
    return result.data;
  },

  // הוספת משימה חדשה (POST)
  addTask: async (name) => {
    if (!name) throw new Error("Name is required");
    // מוסיפים את הנתיב /items
    const result = await axios.post(`${apiUrl}/items`, { name, isComplete: false }); // ⬅️ הוספנו /items
    return result.data;
  },

  // עדכון isComplete (PUT)
  setCompleted: async (id, isComplete, currentName) => {
    if (id == null) throw new Error("Id is required");
    // מוסיפים את הנתיב /items ואז את ה-ID
    const result = await axios.put(`${apiUrl}/items/${id}`, { // ⬅️ הוספנו /items/
      id,
      name: currentName, 
      isComplete
    });
    return result.data;
  },

  // מחיקת משימה (DELETE)
  deleteTask: async (id) => {
    if (id == null) throw new Error("Id is required");
    await axios.delete(`${apiUrl}/items/${id}`); // ⬅️ הוספנו /items/
  }
};

export default apiService;