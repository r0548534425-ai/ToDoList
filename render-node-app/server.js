const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// פונקציה שמביאה את רשימת השירותים מ-Render
const getServices = async () => {
  try {
    const response = await axios.get("https://api.render.com/v1/services", {
      headers: {
        Authorization: `Bearer ${process.env.RENDER_API_KEY}`
      }
    });
    return response.data;
  } catch (err) {
    console.error(err.response?.data || err);
    return { error: "Failed to fetch data from Render API" };
  }
};

// "/" ו־"/services" מציגים את אותה רשימה
const servicesHandler = async (req, res) => {
  const services = await getServices();
  res.json(services);
};

app.get("/", servicesHandler);
app.get("/services", servicesHandler);

// כאן אפשר לשים נתיבים אחרים שלא ישפיעו
// לדוגמה:
app.get("/about", (req, res) => {
  res.send("דף אודות רגיל");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
