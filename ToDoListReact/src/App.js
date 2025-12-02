import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, CheckSquare, PlusCircle } from 'lucide-react'; 
import './App.css'; 

// 🛑 עדכון קריטי: כתובת ה-Backend המלאה והנכונה
const API_URL = "https://todolistserver-g9dd.onrender.com/items"; // ⬅️ זו הכתובת המלאה

function App() {
  const [tasks, setTasks] = useState([]);
}

