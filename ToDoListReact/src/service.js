import axios from 'axios';


const apiUrl = process.env.REACT_APP_API_BASE_URL;

// זה יציג את הכתובת המלאה שה-Build טען
console.log("API URL Loaded:", apiUrl); 

const apiService = {
  
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
    // נתיב: https://.../items/ID
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