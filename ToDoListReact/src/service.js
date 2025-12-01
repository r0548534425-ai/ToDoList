import axios from 'axios';

// ⬅️ התיקון: ה-Fallback חייב לכלול את הנתיב /items
const fallbackUrl = "https://todolistserver-g9dd.onrender.com/items";
// אם המשתנה ריק, apiUrl יקבל את הכתובת המלאה
const apiUrl = process.env.REACT_APP_API_BASE_URL || fallbackUrl; 

// console.log("Environment vars:", process.env); // אין צורך בהדפסת כל המשתנים
console.log("API URL Loaded:", apiUrl); 

const apiService = {
  // שליפת כל המשימות (GET)
  getTasks: async () => {
    // ⬅️ עכשיו apiUrl מכיל את /items, אז לא מוסיפים אותו שוב
    const result = await axios.get(apiUrl); 
    return result.data;
  },

  // הוספת משימה חדשה (POST)
  addTask: async (name) => {
    if (!name) throw new Error("Name is required");
    // ⬅️ עכשיו apiUrl מכיל את /items, אז לא מוסיפים אותו שוב
    const result = await axios.post(apiUrl, { name, isComplete: false }); 
    return result.data;
  },

  // עדכון isComplete (PUT)
  setCompleted: async (id, isComplete, currentName) => {
    if (id == null) throw new Error("Id is required");
    // ⬅️ מוסיפים רק את ה-ID
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
    // ⬅️ מוסיפים רק את ה-ID
    await axios.delete(`${apiUrl}/${id}`); 
  }
};

export default apiService;