// import axios from 'axios';

// // 🛑 IMPORTANT: If REACT_APP_API_BASE_URL is empty, we fall back to the known working Backend URL.
// // CHANGE THIS URL if your server is hosted elsewhere!
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://todolistserver-g9dd.onrender.com/"; 

// console.log("API URL Loaded:", API_BASE_URL); 

// // Function to handle API call retry with exponential backoff
// const fetchWithRetry = async (fetchFunction) => {
//   const maxRetries = 5;
//   let delay = 1000;
  
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       return await fetchFunction();
//     } catch (error) {
//       if (i === maxRetries - 1) {
//         console.error("API call failed after multiple retries:", error);
//         throw error;
//       }
//       console.warn(`Retry attempt ${i + 1} of ${maxRetries}. Retrying in ${delay / 1000}s...`);
//       await new Promise(resolve => setTimeout(resolve, delay));
//       delay *= 2; // Exponential backoff
//     }
//   }
// };

// const apiService = {
//   // Expose the URL for the App component to display it in the UI
//   apiUrl: API_BASE_URL, 

//   // שליפת כל המשימות (GET)
//   getTasks: async () => {
//     return fetchWithRetry(async () => {
//         const result = await axios.get(`${API_BASE_URL}/items`);
//         return result.data;
//     });
//   },

//   // הוספת משימה חדשה (POST)
//   addTask: async (name) => {
//     if (!name) throw new Error("Name is required");
//     return fetchWithRetry(async () => {
//         const result = await axios.post(`${API_BASE_URL}/items`, { name, isComplete: false });
//         return result.data;
//     });
//   },

//   // עדכון isComplete (PUT)
//   setCompleted: async (id, isComplete, currentName) => {
//     if (id == null) throw new Error("Id is required");
//     return fetchWithRetry(async () => {
//         const result = await axios.put(`${API_BASE_URL}/items/${id}`, {
//             id,
//             name: currentName, 
//             isComplete
//         });
//         return result.data;
//     });
//   },

//   // מחיקת משימה (DELETE)
//   deleteTask: async (id) => {
//     if (id == null) throw new Error("Id is required");
//     return fetchWithRetry(async () => {
//         await axios.delete(`${API_BASE_URL}/items/${id}`);
//     });
//   },

//   // עריכת שם משימה (PUT) - פונקציה חסרה שהוספתי
//   editTask: async (id, newName, isComplete) => {
//     if (id == null || !newName) throw new Error("Id and name are required");
//     return fetchWithRetry(async () => {
//       const result = await axios.put(`${API_BASE_URL}/items/${id}`, {
//         id,
//         name: newName,
//         isComplete
//       });
//       return result.data;
//     });
//   }
// };

// export default apiService;